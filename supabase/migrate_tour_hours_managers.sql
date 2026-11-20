-- House managers can read and save the shared tour hours.
-- Safe to re-run. Run this in the Supabase SQL editor.

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
  if actor is null or actor.id is null or actor.role not in ('owner', 'developer', 'administrator', 'house_manager') then
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
  if actor is null or actor.id is null or actor.role not in ('owner', 'developer', 'administrator', 'house_manager') then
    return jsonb_build_object('ok', false, 'error', 'Not allowed.');
  end if;
  return public.replace_tour_availability(p_windows);
end;
$$;
