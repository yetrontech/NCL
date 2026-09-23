-- Extra residency questions on applications and referrals.
-- Safe to re-run. Run this before new apply/refer submissions, or inserts fail.
-- The house app migration NCLMobile/supabase/migrate-scope-lifecycle.sql
-- adds the same columns plus safety tags, move-in, and move-out.

alter table public.applications add column if not exists former_address text;
alter table public.applications add column if not exists former_contact text;
alter table public.applications add column if not exists promo_code text;
alter table public.applications add column if not exists has_care_provider text;
alter table public.applications add column if not exists care_provider_name text;
alter table public.applications add column if not exists care_provider_phone text;
alter table public.applications add column if not exists care_provider_address text;
alter table public.applications add column if not exists medicare_medicaid text;

alter table public.referrals add column if not exists former_address text;
alter table public.referrals add column if not exists former_contact text;
alter table public.referrals add column if not exists promo_code text;
alter table public.referrals add column if not exists has_care_provider text;
alter table public.referrals add column if not exists care_provider_name text;
alter table public.referrals add column if not exists care_provider_phone text;
alter table public.referrals add column if not exists care_provider_address text;
alter table public.referrals add column if not exists medicare_medicaid text;

-- Public inserts use the anon key. Anyone with that key can call the API
-- directly, so a new row cannot set workflow columns, and free-text health
-- and address fields are length-capped. Staff updates still go through the
-- service role. No public read is added.

create or replace function public.forms_clamp_text(value text, max_len integer)
returns text
language sql
immutable
as $$
  select nullif(left(btrim(coalesce(value, '')), max_len), '');
$$;

create or replace function public.forms_lock_public_insert()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  jwt_role text := '';
  row_data jsonb := to_jsonb(new);
  patch jsonb;
begin
  begin
    jwt_role := coalesce(auth.role(), '');
  exception
    when undefined_function then
      jwt_role := '';
  end;

  patch := jsonb_build_object(
    'promo_code', public.forms_clamp_text(
      regexp_replace(coalesce(row_data ->> 'promo_code', ''), '[^A-Za-z0-9 _-]', '', 'g'),
      40
    ),
    'former_address', public.forms_clamp_text(row_data ->> 'former_address', 400),
    'former_contact', public.forms_clamp_text(row_data ->> 'former_contact', 200),
    'care_provider_name', public.forms_clamp_text(row_data ->> 'care_provider_name', 120),
    'care_provider_phone', public.forms_clamp_text(row_data ->> 'care_provider_phone', 40),
    'care_provider_address', public.forms_clamp_text(row_data ->> 'care_provider_address', 400),
    'medicare_medicaid', public.forms_clamp_text(row_data ->> 'medicare_medicaid', 16)
  );

  if jwt_role in ('anon', 'authenticated') then
    patch := patch || jsonb_build_object(
      'status', 'pending',
      'deleted_at', null,
      'assigned_house_id', null,
      'accepted_at', null,
      'schedule_token', null,
      'requested_move_in_at', null,
      'move_in_at', null
    );
  end if;

  new := jsonb_populate_record(new, patch);
  return new;
end;
$$;

drop trigger if exists applications_lock_public_insert on public.applications;
create trigger applications_lock_public_insert
  before insert on public.applications
  for each row execute function public.forms_lock_public_insert();

drop trigger if exists referrals_lock_public_insert on public.referrals;
create trigger referrals_lock_public_insert
  before insert on public.referrals
  for each row execute function public.forms_lock_public_insert();

revoke select, update, delete on table public.applications from anon, authenticated, public;
revoke select, update, delete on table public.referrals from anon, authenticated, public;
revoke select, update, delete on table public.tour_requests from anon, authenticated, public;
revoke select, update, delete on table public.benefits_screenings from anon, authenticated, public;

grant insert on table public.applications to anon;
grant insert on table public.referrals to anon;
grant insert on table public.tour_requests to anon;
grant insert on table public.benefits_screenings to anon;

grant execute on function public.forms_clamp_text(text, integer) to anon, authenticated;
grant execute on function public.forms_lock_public_insert() to anon, authenticated;
