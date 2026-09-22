-- Extra residency questions on applications and referrals.
-- Safe to re-run. Run this before new apply/refer submissions, or inserts fail.
-- The house app migration NCLMobile/supabase/migrate-scope-lifecycle.sql
-- adds the same columns plus safety tags, move-in, and move-out.

alter table public.applications add column if not exists former_address text;
alter table public.applications add column if not exists former_contact text;
alter table public.applications add column if not exists mental_diagnosis text;
alter table public.applications add column if not exists has_care_provider text;
alter table public.applications add column if not exists care_provider_contact text;
alter table public.applications add column if not exists care_provider_address text;
alter table public.applications add column if not exists medicare_medicaid text;

alter table public.referrals add column if not exists former_address text;
alter table public.referrals add column if not exists former_contact text;
alter table public.referrals add column if not exists mental_diagnosis text;
alter table public.referrals add column if not exists has_care_provider text;
alter table public.referrals add column if not exists care_provider_contact text;
alter table public.referrals add column if not exists care_provider_address text;
alter table public.referrals add column if not exists medicare_medicaid text;
