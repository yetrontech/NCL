-- Payday days from the application form. Safe to re-run.

alter table public.applications
  add column if not exists pay_days integer[];
