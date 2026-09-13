-- Application household follow-ups and memory-loss question.
-- Safe to re-run. Do not re-run schema.sql.

alter table public.applications
  add column if not exists dependents_kind text,
  add column if not exists dependent_name text,
  add column if not exists dependent_income text,
  add column if not exists memory_loss text;
