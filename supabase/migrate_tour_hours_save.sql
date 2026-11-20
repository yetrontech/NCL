-- Saving tour hours failed with: DELETE requires a WHERE clause.
-- Safe to re-run. Run this in the Supabase SQL editor.

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
  day_of_week int;
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
      day_of_week := (item->>'weekday')::int;
    exception
      when others then
        return jsonb_build_object('ok', false, 'error', 'Pick a day for each range.');
    end;
    start_text := left(btrim(coalesce(item->>'start', '')), 5);
    end_text := left(btrim(coalesce(item->>'end', '')), 5);
    if day_of_week is null or day_of_week < 0 or day_of_week > 6 then
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
        'error', names[day_of_week + 1] || ' needs at least 30 minutes between the start and the end.'
      );
    end if;

    for other in select value from jsonb_array_elements(clean)
    loop
      other_weekday := (other->>'weekday')::int;
      other_start := (other->>'start')::time;
      other_end := (other->>'end')::time;
      if other_weekday = day_of_week and start_at < other_end and end_at > other_start then
        return jsonb_build_object(
          'ok', false,
          'error', names[day_of_week + 1] || ' has two ranges that overlap. Combine them into one.'
        );
      end if;
    end loop;

    clean := clean || jsonb_build_array(jsonb_build_object(
      'weekday', day_of_week,
      'start', to_char(start_at, 'HH24:MI'),
      'end', to_char(end_at, 'HH24:MI')
    ));
  end loop;

  delete from public.tour_availability where weekday between 0 and 6;
  insert into public.tour_availability (weekday, start_time, end_time)
  select
    (value->>'weekday')::smallint,
    (value->>'start')::time,
    (value->>'end')::time
  from jsonb_array_elements(clean);

  return jsonb_build_object('ok', true);
end;
$$;
