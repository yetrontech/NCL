-- Counts two public buttons: the calculator offer, and "See if you're a good fit".
-- Safe to re-run. The website writes with the service role. The house app reads
-- through owner_site_click_counts, which only the owner and developer can call.

create table if not exists public.site_clicks (
  id uuid primary key default gen_random_uuid(),
  click_key text not null check (click_key in ('calculate_offer', 'offer_fit')),
  created_at timestamptz not null default now()
);

create index if not exists site_clicks_key_created_idx
  on public.site_clicks (click_key, created_at desc);

alter table public.site_clicks enable row level security;
revoke all on table public.site_clicks from anon, authenticated, public;

create or replace function public.owner_site_click_counts(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.house_profiles;
  offer_total bigint;
  offer_week bigint;
  fit_total bigint;
  fit_week bigint;
begin
  actor := public._house_actor_from_token(p_token);
  if actor is null or actor.id is null or actor.role not in ('owner', 'developer') then
    return jsonb_build_object('ok', false, 'error', 'Not allowed.');
  end if;

  select
    count(*) filter (where click_key = 'calculate_offer'),
    count(*) filter (where click_key = 'calculate_offer' and created_at >= now() - interval '7 days'),
    count(*) filter (where click_key = 'offer_fit'),
    count(*) filter (where click_key = 'offer_fit' and created_at >= now() - interval '7 days')
  into offer_total, offer_week, fit_total, fit_week
  from public.site_clicks;

  return jsonb_build_object(
    'ok', true,
    'calculate_offer', offer_total,
    'calculate_offer_week', offer_week,
    'offer_fit', fit_total,
    'offer_fit_week', fit_week
  );
end;
$$;

revoke all on function public.owner_site_click_counts(uuid) from public;
grant execute on function public.owner_site_click_counts(uuid) to anon, authenticated;
