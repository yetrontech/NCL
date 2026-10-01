-- Public remaining-bed total for the website guide page.
-- Returns one integer: open beds across every house.
-- Open = capacity minus current residents (moved out excluded) minus
-- accepted or scheduled people who do not have a house profile yet.
-- Does not return names, houses, or any other row. Safe to re-run.
-- Run in the Supabase SQL Editor.

create or replace function public.public_beds_remaining()
returns integer
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  total integer := 0;
begin
  select coalesce(sum(greatest(
    h.capacity
      - public._house_occupied(h.id)
      - public._house_incoming(h.id),
    0
  )), 0)::integer
  into total
  from public.houses h;

  return total;
exception
  when undefined_function then
    select coalesce(sum(greatest(
      h.capacity - public._house_occupied(h.id),
      0
    )), 0)::integer
    into total
    from public.houses h;

    return total;
end;
$$;

revoke all on function public.public_beds_remaining() from public;
grant execute on function public.public_beds_remaining() to anon, authenticated;
