-- Older tour booking. migrate_tour_availability.sql replaces the house picker
-- with owner-set hours. Run that file last if you re-run this one.
-- Public tours pick a listed house and an open time.
-- Busy blocks stay private. The visit is created so that house manager can acknowledge it.
-- Safe to re-run. Run in the Supabase SQL editor after the house tour migrations.

alter table public.tour_requests
  add column if not exists house_id text;

alter table public.tour_requests
  add column if not exists starts_at timestamptz;

create or replace function public.public_list_tour_houses(p_gender text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  houses jsonb;
  gender text;
begin
  gender := btrim(coalesce(p_gender, ''));
  if gender not in ('Male', 'Female') then
    return jsonb_build_object('ok', true, 'houses', '[]'::jsonb);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('id', h.id, 'name', h.name) order by h.name), '[]'::jsonb)
  into houses
  from public.houses h
  join public.house_profiles m on m.id = h.manager_id
  where h.public_listed
    and h.gender = gender
    and m.role = 'house_manager'
    and m.login_closed_at is null;

  return jsonb_build_object('ok', true, 'houses', coalesce(houses, '[]'::jsonb));
end;
$$;

create or replace function public.public_list_tour_slots(p_house_id text, p_date text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_house public.houses;
  slot time;
  span tstzrange;
  slots jsonb := '[]'::jsonb;
begin
  if p_date is null or p_date !~ '^\d{4}-\d{2}-\d{2}$' then
    return jsonb_build_object('ok', false, 'error', 'Pick a tour date.');
  end if;
  if p_date::date < (timezone('America/New_York', now()))::date then
    return jsonb_build_object('ok', true, 'slots', '[]'::jsonb);
  end if;

  select * into v_house
  from public.houses
  where id = p_house_id
    and public_listed
    and manager_id is not null;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'That house is not open for tours.');
  end if;

  slot := time '09:00';
  while slot <= time '16:30' loop
    span := public.house_eastern_range(p_date, to_char(slot, 'HH24:MI'), 30);
    if span is not null
      and lower(span) > now()
      and not public.house_manager_is_busy(v_house.manager_id, lower(span), upper(span))
    then
      slots := slots || jsonb_build_array(to_char(slot, 'HH24:MI'));
    end if;
    slot := (slot + interval '30 minutes')::time;
  end loop;

  return jsonb_build_object('ok', true, 'slots', slots);
end;
$$;

create or replace function public.public_book_tour(
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_email text,
  p_gender text,
  p_house_id text,
  p_date text,
  p_time text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_house public.houses;
  v_manager public.house_profiles;
  first_name text;
  last_name text;
  phone text;
  email text;
  gender text;
  span tstzrange;
  new_id uuid;
  synced jsonb;
  ack_id uuid;
begin
  first_name := left(btrim(coalesce(p_first_name, '')), 80);
  last_name := left(btrim(coalesce(p_last_name, '')), 80);
  phone := left(btrim(coalesce(p_phone, '')), 40);
  email := lower(left(btrim(coalesce(p_email, '')), 120));
  gender := btrim(coalesce(p_gender, ''));

  if first_name = '' or last_name = '' or phone = '' or email = '' then
    return jsonb_build_object('ok', false, 'error', 'Please fill in all required fields.');
  end if;
  if email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    return jsonb_build_object('ok', false, 'error', 'Enter a valid email.');
  end if;
  if gender not in ('Male', 'Female') then
    return jsonb_build_object('ok', false, 'error', 'Select a gender.');
  end if;
  if p_time is null or p_time !~ '^\d{2}:\d{2}$' then
    return jsonb_build_object('ok', false, 'error', 'Pick an open time.');
  end if;

  select * into v_house
  from public.houses
  where id = p_house_id
    and public_listed
    and gender = gender;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Choose a house.');
  end if;

  select * into v_manager
  from public.house_profiles
  where id = v_house.manager_id
    and role = 'house_manager'
    and login_closed_at is null;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'That house is not open for tours.');
  end if;

  span := public.house_eastern_range(p_date, p_time, 30);
  if span is null or lower(span) <= now() then
    return jsonb_build_object('ok', false, 'error', 'Pick an open time.');
  end if;
  if public.house_manager_is_busy(v_manager.id, lower(span), upper(span)) then
    return jsonb_build_object('ok', false, 'error', 'That time was just taken. Pick another.');
  end if;

  insert into public.tour_requests (
    first_name, last_name, phone, email, preferred_date, gender, house_id, starts_at
  ) values (
    first_name, last_name, phone, email, p_date::date, gender, v_house.id, lower(span)
  )
  returning id into new_id;

  update public.tour_requests
  set tour_scheduled = true,
      scheduled_date = p_date::date,
      scheduled_time = (p_time || ':00')::time
  where id = new_id;

  synced := public._sync_tour_calendar_event(new_id, true, p_date, p_time, v_manager.id);
  if coalesce(synced->>'ok', 'false') <> 'true' then
    raise exception '%', coalesce(synced->>'error', 'Could not book that tour.');
  end if;

  ack_id := public._upsert_visit_ack(
    'tour',
    'tour',
    new_id,
    v_house.id,
    v_manager.id,
    coalesce(synced->>'personName', first_name || ' ' || last_name),
    (synced->>'startsAt')::timestamptz,
    (synced->>'endsAt')::timestamptz
  );

  return jsonb_build_object(
    'ok', true,
    'id', new_id,
    'houseName', v_house.name,
    'managerEmail', v_manager.email,
    'ackId', ack_id
  );
end;
$$;

revoke all on function public.public_list_tour_houses(text) from public;
revoke all on function public.public_list_tour_slots(text, text) from public;
revoke all on function public.public_book_tour(text, text, text, text, text, text, text, text) from public;
grant execute on function public.public_list_tour_houses(text) to anon, authenticated;
grant execute on function public.public_list_tour_slots(text, text) to anon, authenticated;
grant execute on function public.public_book_tour(text, text, text, text, text, text, text, text) to anon, authenticated;
