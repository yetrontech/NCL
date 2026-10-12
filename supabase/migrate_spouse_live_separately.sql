-- Spouse follow-up on applications.
-- Safe to re-run. Run in the Supabase SQL Editor.

alter table public.applications
  add column if not exists spouse_live_separately text;
