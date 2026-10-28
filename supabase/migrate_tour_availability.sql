-- Owner-set tour hours. Guests pick a time from these ranges.
-- They do not pick a house. Safe to re-run after migrate_public_tour.sql.

create table if not exists public.tour_availability (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  constraint tour_availability_span check (end_time > start_time)
);

create index if not exists tour_availability_weekday_idx
  on public.tour_availability (weekday, start_time);

alter table public.tour_availability enable row level security;
revoke all on table public.tour_availability from anon, authenticated, public;

alter table public.tour_requests
  add column if not exists tour_scheduled boolean not null default false;

alter table public.tour_requests
  add column if not exists scheduled_date date;

alter table public.tour_requests
  add column if not exists scheduled_time time;

create unique index if not exists tour_requests_booked_start_idx
  on public.tour_requests (starts_at)
  where tour_scheduled and starts_at is not null;

create or replace function public.replace_tour_availability(p_windows jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  other jsonb;
  clean jsonb := '[]'::jsonb;
  names text[] := array['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  weekday int;
  start_text text;
  end_text text;
  start_at time;
  end_at time;
  other_weekday int;
  other_start time;
  other_end time;
begin
  if p_windows is null or jsonb_typeof(p_windows) is distinct from 'array' then
    return jsonb_build_object('ok', false, 'error', 'Add the tour times again.');
  end if;
  if jsonb_array_length(p_windows) > 28 then
    return jsonb_build_object('ok', false, 'error', 'Keep it to 28 ranges.');
  end if;

  for item in select value from jsonb_array_elements(p_windows)
  loop
    begin
      weekday := (item->>'weekday')::int;
    exception
      when others then
        return jsonb_build_object('ok', false, 'error', 'Pick a day for each range.');
    end;
    start_text := left(btrim(coalesce(item->>'start', '')), 5);
    end_text := left(btrim(coalesce(item->>'end', '')), 5);
    if weekday is null or weekday < 0 or weekday > 6 then
      return jsonb_build_object('ok', false, 'error', 'Pick a day for each range.');
    end if;
    if start_text !~ '^\d{2}:\d{2}$' or end_text !~ '^\d{2}:\d{2}$' then
      return jsonb_build_object('ok', false, 'error', 'Use a start and end time for each range.');
    end if;
    begin
      start_at := start_text::time;
      end_at := end_text::time;
    exception
      when others then
        return jsonb_build_object('ok', false, 'error', 'Use a start and end time for each range.');
    end;
    if end_at <= start_at or end_at - start_at < interval '30 minutes' then
      return jsonb_build_object(
        'ok', false,
        'error', names[weekday + 1] || ' needs at least 30 minutes between the start and the end.'
      );
    end if;

    for other in select value from jsonb_array_elements(clean)
    loop
      other_weekday := (other->>'weekday')::int;
      other_start := (other->>'start')::time;
      other_end := (other->>'end')::time;
      if other_weekday = weekday and start_at < other_end and end_at > other_start then
        return jsonb_build_object(
          'ok', false,
          'error', names[weekday + 1] || ' has two ranges that overlap. Combine them into one.'
        );
      end if;
    end loop;

    clean := clean || jsonb_build_array(jsonb_build_object(
      'weekday', weekday,
      'start', to_char(start_at, 'HH24:MI'),
      'end', to_char(end_at, 'HH24:MI')
    ));
  end loop;

  delete from public.tour_availability;
  insert into public.tour_availability (weekday, start_time, end_time)
  select
    (value->>'weekday')::smallint,
    (value->>'start')::time,
    (value->>'end')::time
  from jsonb_array_elements(clean);

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.owner_list_tour_availability(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.house_profiles;
  windows jsonb;
begin
  actor := public._house_actor_from_token(p_token);
  if actor is null or actor.id is null or not (
    public._house_is_house_admin(actor) or actor.role = 'developer'
  ) then
    return jsonb_build_object('ok', false, 'error', 'Not allowed.');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'weekday', w.weekday,
    'start', to_char(w.start_time, 'HH24:MI'),
    'end', to_char(w.end_time, 'HH24:MI')
  ) order by w.weekday, w.start_time), '[]'::jsonb)
  into windows
  from public.tour_availability w;

  return jsonb_build_object('ok', true, 'windows', windows);
end;
$$;

create or replace function public.owner_set_tour_availability(p_token uuid, p_windows jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.house_profiles;
begin
  actor := public._house_actor_from_token(p_token);
  if actor is null or actor.id is null or not (
    public._house_is_house_admin(actor) or actor.role = 'developer'
  ) then
    return jsonb_build_object('ok', false, 'error', 'Not allowed.');
  end if;
  return public.replace_tour_availability(p_windows);
end;
$$;

create or replace function public._tour_slot_taken(p_span tstzrange)
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.tour_requests t
    where t.tour_scheduled
      and t.starts_at is not null
      and t.starts_at < upper(p_span)
      and t.starts_at + interval '30 minutes' > lower(p_span)
  )
  or exists (
    select 1
    from public.house_calendar_events e
    where e.kind = 'tour'
      and e.starts_at < upper(p_span)
      and e.ends_at > lower(p_span)
  );
$$;

drop function if exists public.public_list_tour_slots(text, text);

create or replace function public.public_list_tour_slots(p_date text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  hours record;
  slot time;
  slot_end time;
  span tstzrange;
  slot_text text;
  found text[] := '{}';
  slots jsonb := '[]'::jsonb;
  configured boolean;
  weekday int;
begin
  if p_date is null or p_date !~ '^\d{4}-\d{2}-\d{2}$' then
    return jsonb_build_object('ok', false, 'error', 'Pick a tour date.');
  end if;

  select exists (select 1 from public.tour_availability) into configured;
  if p_date::date < (timezone('America/New_York', now()))::date then
    return jsonb_build_object('ok', true, 'configured', configured, 'slots', '[]'::jsonb);
  end if;

  weekday := extract(dow from p_date::date)::int;
  for hours in
    select start_time, end_time
    from public.tour_availability
    where tour_availability.weekday = weekday
    order by start_time
  loop
    slot := hours.start_time;
    while slot < hours.end_time loop
      slot_end := (slot + interval '30 minutes')::time;
      exit when slot_end <= slot;
      exit when slot_end > hours.end_time;
      span := public.house_eastern_range(p_date, to_char(slot, 'HH24:MI'), 30);
      slot_text := to_char(slot, 'HH24:MI');
      if span is not null
        and lower(span) > now()
        and not slot_text = any(found)
        and not public._tour_slot_taken(span)
      then
        found := found || slot_text;
      end if;
      slot := slot_end;
    end loop;
  end loop;

  select coalesce(jsonb_agg(to_jsonb(item) order by item), '[]'::jsonb)
  into slots
  from unnest(found) as item;

  return jsonb_build_object('ok', true, 'configured', configured, 'slots', slots);
end;
$$;

drop function if exists public.public_book_tour(text, text, text, text, text, text, text, text);

create or replace function public.public_book_tour(
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_email text,
  p_gender text,
  p_date text,
  p_time text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  first_name text;
  last_name text;
  phone text;
  email text;
  gender text;
  slot text;
  span tstzrange;
  allowed boolean;
  new_id uuid;
  synced jsonb;
begin
  first_name := left(btrim(coalesce(p_first_name, '')), 80);
  last_name := left(btrim(coalesce(p_last_name, '')), 80);
  phone := left(btrim(coalesce(p_phone, '')), 40);
  email := lower(left(btrim(coalesce(p_email, '')), 120));
  gender := btrim(coalesce(p_gender, ''));
  slot := left(btrim(coalesce(p_time, '')), 5);

  if first_name = '' or last_name = '' or phone = '' or email = '' then
    return jsonb_build_object('ok', false, 'error', 'Please fill in all required fields.');
  end if;
  if email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    return jsonb_build_object('ok', false, 'error', 'Enter a valid email.');
  end if;
  if gender not in ('Male', 'Female') then
    return jsonb_build_object('ok', false, 'error', 'Select a gender.');
  end if;
  if p_date is null or p_date !~ '^\d{4}-\d{2}-\d{2}$' or slot !~ '^\d{2}:\d{2}$' then
    return jsonb_build_object('ok', false, 'error', 'Pick an open time.');
  end if;

  span := public.house_eastern_range(p_date, slot, 30);
  if span is null or lower(span) <= now() then
    return jsonb_build_object('ok', false, 'error', 'Pick an open time.');
  end if;

  select exists (
    select 1
    from public.tour_availability w
    where w.weekday = extract(dow from p_date::date)::int
      and (lower(span) at time zone 'America/New_York')::time >= w.start_time
      and (upper(span) at time zone 'America/New_York')::time <= w.end_time
  ) into allowed;

  if not allowed then
    return jsonb_build_object('ok', false, 'error', 'That time is not open. Pick another.');
  end if;
  if public._tour_slot_taken(span) then
    return jsonb_build_object('ok', false, 'error', 'That time was just taken. Pick another.');
  end if;

  begin
    insert into public.tour_requests (
      first_name, last_name, phone, email, preferred_date, gender,
      house_id, starts_at, tour_scheduled, scheduled_date, scheduled_time
    ) values (
      first_name, last_name, phone, email, p_date::date, gender,
      null, lower(span), true, p_date::date, (slot || ':00')::time
    )
    returning id into new_id;
  exception
    when unique_violation then
      return jsonb_build_object('ok', false, 'error', 'That time was just taken. Pick another.');
  end;

  synced := public._sync_tour_calendar_event(new_id, true, p_date, slot, null);
  if coalesce(synced->>'ok', 'false') <> 'true' then
    raise exception '%', coalesce(synced->>'error', 'Could not book that tour.');
  end if;

  return jsonb_build_object('ok', true, 'id', new_id);
end;
$$;

create or replace function public._sync_tour_calendar_event(
  p_id uuid,
  p_scheduled boolean,
  p_date text,
  p_time text,
  p_actor text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  span tstzrange;
  name text;
  v_house text;
  v_manager text;
begin
  delete from public.house_calendar_events
  where source_kind = 'tour' and source_id = p_id;

  if not coalesce(p_scheduled, false) then
    perform public._insert_tour_requested(p_id);
    delete from public.staff_visit_acks where kind = 'tour' and subject_id = p_id;
    return jsonb_build_object('ok', true);
  end if;

  select t.house_id, h.manager_id
    into v_house, v_manager
  from public.tour_requests t
  left join public.houses h on h.id = t.house_id
  where t.id = p_id;

  span := public.house_eastern_range(p_date, p_time, 30);
  if span is null then
    return jsonb_build_object('ok', false, 'error', 'Pick a tour date and time.');
  end if;

  name := coalesce(public._staff_person_name('tour', p_id), 'Tour');

  if v_house is null then
    insert into public.house_calendar_events (
      kind, title, starts_at, ends_at, created_by, manager_id, source_kind, source_id
    ) values (
      'tour',
      'Tour · ' || name,
      lower(span),
      upper(span),
      nullif(p_actor, ''),
      null,
      'tour',
      p_id
    );
    return jsonb_build_object(
      'ok', true,
      'startsAt', lower(span),
      'endsAt', upper(span),
      'personName', name
    );
  end if;

  if v_manager is null then
    return jsonb_build_object('ok', false, 'error', 'Assign a house manager to that house first. Open Houses and choose who runs it.');
  end if;

  if public.house_manager_is_busy(v_manager, lower(span), upper(span)) then
    return jsonb_build_object('ok', false, 'error', 'That house manager is already marked unavailable then. Pick another time.');
  end if;

  insert into public.house_calendar_events (
    kind, title, starts_at, ends_at, created_by, manager_id, source_kind, source_id
  ) values (
    'tour',
    'Tour · ' || name,
    lower(span),
    upper(span),
    p_actor,
    v_manager,
    'tour',
    p_id
  );

  return jsonb_build_object(
    'ok', true,
    'startsAt', lower(span),
    'endsAt', upper(span),
    'managerId', v_manager,
    'personName', name
  );
end;
$$;

revoke all on function public.replace_tour_availability(jsonb) from public;
revoke all on function public.owner_list_tour_availability(uuid) from public;
revoke all on function public.owner_set_tour_availability(uuid, jsonb) from public;
revoke all on function public._tour_slot_taken(tstzrange) from public;
revoke all on function public.public_list_tour_slots(text) from public;
revoke all on function public.public_book_tour(text, text, text, text, text, text, text) from public;

grant execute on function public.replace_tour_availability(jsonb) to service_role;
grant execute on function public.owner_list_tour_availability(uuid) to anon, authenticated;
grant execute on function public.owner_set_tour_availability(uuid, jsonb) to anon, authenticated;
grant execute on function public.public_list_tour_slots(text) to anon, authenticated;
grant execute on function public.public_book_tour(text, text, text, text, text, text, text) to anon, authenticated;
