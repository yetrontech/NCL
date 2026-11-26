-- Who an applicant may want to recover with. Safe to re-run.

alter table public.applications add column if not exists recovery_partner_name text;
alter table public.applications add column if not exists recovery_partner_phone text;
alter table public.applications add column if not exists recovery_partner_email text;
