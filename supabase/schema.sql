-- New Creation Living: form submission tables
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query).

-- ============ Direct residency applications (self-apply) ============
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  gender text not null,
  date_of_birth date not null,
  benefit_type text not null,
  situation_explanation text not null,
  mobility_limitations text not null,
  mobility_explanation text,
  mental_limitations text not null,
  mental_explanation text,
  medications_independent text not null,
  crime_conviction text not null,
  crime_explanation text,
  substance_abuse_history text,
  substance_abuse_explanation text,
  monthly_benefit_amount text not null,
  medical_prescriptions text not null,
  medical_explanation text,
  drug_free_commitment text not null,
  value_understanding text not null,
  living_with_others text not null,
  home_not_short_term text not null,
  payee_agreement text not null,
  roommate_commitment text not null,
  referring_party_info text not null,
  how_heard text not null,
  move_timeline text not null,
  emergency_contact text,
  favorability_score integer,
  favorability_max_score integer,
  favorability_percent integer,
  favorability_label text
);

-- ============ Residency / Referral form ============
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  referrer_name text not null,
  referrer_role text not null,
  organization text,
  phone text not null,
  email text not null,
  referee_first_name text not null,
  referee_last_name text not null,
  referee_phone text,
  referee_email text,
  gender text not null,
  date_of_birth date not null,
  benefit_type text not null,
  situation_explanation text not null,
  mobility_limitations text not null,
  mobility_explanation text,
  mental_limitations text not null,
  mental_explanation text,
  medications_independent text not null,
  crime_conviction text not null,
  crime_explanation text,
  substance_abuse_history text,
  substance_abuse_explanation text,
  aggression_history text not null,
  elopement_risk text not null,
  communal_living_interference text not null,
  monthly_benefit_amount text not null,
  medical_prescriptions text not null,
  medical_explanation text,
  drug_free_commitment text not null,
  value_understanding text not null,
  living_with_others text not null,
  home_not_short_term text not null,
  payee_agreement text not null,
  roommate_commitment text not null,
  how_heard text not null,
  move_timeline text not null,
  emergency_contact text,
  favorability_score integer,
  favorability_max_score integer,
  favorability_percent integer,
  favorability_label text
);

-- ============ Tour scheduling requests ============
create table if not exists public.tour_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  preferred_date date not null,
  gender text not null
);

-- ============ Benefits screening form ============
create table if not exists public.benefits_screenings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  benefit_type text not null,
  applied_before text not null,
  notes text,
  served_military text not null,
  disability_12_months text not null,
  ss_work_history text not null,
  last_worked text not null,
  monthly_income_assets text not null
);

-- ============ Editable marketing-site copy ============
-- Seeded by supabase/migrate_site_content.sql
create table if not exists public.site_content (
  key text primary key,
  value text not null,
  section text not null,
  label text not null,
  field_type text not null default 'text',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ============ Row Level Security ============
alter table public.referrals enable row level security;
alter table public.applications enable row level security;
alter table public.tour_requests enable row level security;
alter table public.benefits_screenings enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "Allow anonymous referral submissions" on public.referrals;
create policy "Allow anonymous referral submissions"
  on public.referrals
  for insert
  to anon
  with check (true);

drop policy if exists "Allow anonymous application submissions" on public.applications;
create policy "Allow anonymous application submissions"
  on public.applications
  for insert
  to anon
  with check (true);

drop policy if exists "Allow anonymous tour request submissions" on public.tour_requests;
create policy "Allow anonymous tour request submissions"
  on public.tour_requests
  for insert
  to anon
  with check (true);

drop policy if exists "Allow anonymous benefits screening submissions" on public.benefits_screenings;
create policy "Allow anonymous benefits screening submissions"
  on public.benefits_screenings
  for insert
  to anon
  with check (true);

drop policy if exists "Allow public read of site content" on public.site_content;
create policy "Allow public read of site content"
  on public.site_content
  for select
  to anon, authenticated
  using (true);
