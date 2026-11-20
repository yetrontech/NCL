-- Tours use the move-in window: 9:00 AM to 7:30 PM, every 30 minutes.
-- A busy range removes only the 30-minute slots it overlaps. The rest of that day stays open.
-- Safe to re-run. Run this in the Supabase SQL editor.

create or replace function public._tour_blocked_by_unavailable(p_span tstzrange)
returns boolean
language sql
stable
set search_path = public
as $$
  select p_span is not null
    and exists (
      select 1
      from public.house_calendar_events e
      where e.kind = 'manager_busy'
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
  slot time := time '09:00';
  span tstzrange;
  slot_text text;
  found text[] := '{}';
  slots jsonb := '[]'::jsonb;
begin
  if p_date is null or p_date !~ '^\d{4}-\d{2}-\d{2}$' then
    return jsonb_build_object('ok', false, 'error', 'Pick a tour date.');
  end if;

  if p_date::date < (timezone('America/New_York', now()))::date then
    return jsonb_build_object('ok', true, 'configured', true, 'slots', '[]'::jsonb);
  end if;

  while slot <= time '19:30' loop
    span := public.house_eastern_range(p_date, to_char(slot, 'HH24:MI'), 30);
    slot_text := to_char(slot, 'HH24:MI');
    if span is not null
      and lower(span) > now()
      and not public._tour_slot_taken(span)
      and not public._tour_blocked_by_unavailable(span)
    then
      found := found || slot_text;
    end if;
    slot := (slot + interval '30 minutes')::time;
  end loop;

  select coalesce(jsonb_agg(to_jsonb(item) order by item), '[]'::jsonb)
  into slots
  from unnest(found) as item;

  return jsonb_build_object('ok', true, 'configured', true, 'slots', slots);
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

  if slot < '09:00' or slot > '19:30' or right(slot, 3) not in (':00', ':30') then
    return jsonb_build_object('ok', false, 'error', 'Pick a time between 9:00 AM and 7:30 PM.');
  end if;
  if public._tour_blocked_by_unavailable(span) then
    return jsonb_build_object('ok', false, 'error', 'That time is unavailable. Pick another.');
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

revoke all on function public._tour_blocked_by_unavailable(tstzrange) from public;
revoke all on function public.public_list_tour_slots(text) from public;
revoke all on function public.public_book_tour(text, text, text, text, text, text, text) from public;
grant execute on function public.public_list_tour_slots(text) to anon, authenticated;
grant execute on function public.public_book_tour(text, text, text, text, text, text, text) to anon, authenticated;
