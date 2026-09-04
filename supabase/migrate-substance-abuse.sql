-- Drug / alcohol abuse history on apply + refer. Ideal answer is No.
-- Safe to re-run. Existing rows stay null so stored scores do not drop.

alter table public.applications
  add column if not exists substance_abuse_history text;

alter table public.applications
  add column if not exists substance_abuse_explanation text;

alter table public.referrals
  add column if not exists substance_abuse_history text;

alter table public.referrals
  add column if not exists substance_abuse_explanation text;
