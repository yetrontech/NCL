-- Pre-tour evaluation. Same questions as the quick check, saved for staff to approve or deny.
-- An approval emails a link to schedule a tour. Safe to re-run.

create table if not exists public.tour_evaluations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  gender text not null check (gender in ('Male', 'Female')),
  answers jsonb not null default '[]'::jsonb,
  fit boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'denied')),
  schedule_token text unique,
  tour_request_id uuid,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists tour_evaluations_recent_idx
  on public.tour_evaluations (created_at desc);

alter table public.tour_evaluations enable row level security;
revoke all on table public.tour_evaluations from anon, authenticated, public;

create or replace function public.public_submit_tour_eval(
  p_first text,
  p_last text,
  p_email text,
  p_phone text,
  p_gender text,
  p_answers jsonb,
  p_fit boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  first_name text;
  last_name text;
  email text;
  phone text;
  gender text;
  new_id uuid;
begin
  first_name := left(btrim(coalesce(p_first, '')), 80);
  last_name := left(btrim(coalesce(p_last, '')), 80);
  email := lower(left(btrim(coalesce(p_email, '')), 120));
  phone := left(btrim(coalesce(p_phone, '')), 40);
  gender := btrim(coalesce(p_gender, ''));

  if first_name = '' or last_name = '' or phone = '' or email = '' then
    return jsonb_build_object('ok', false, 'error', 'Please fill in your name, phone, and email.');
  end if;
  if email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    return jsonb_build_object('ok', false, 'error', 'Enter a valid email.');
  end if;
  if gender not in ('Male', 'Female') then
    return jsonb_build_object('ok', false, 'error', 'Select a gender.');
  end if;
  if jsonb_typeof(p_answers) is distinct from 'array' or jsonb_array_length(p_answers) > 20 then
    return jsonb_build_object('ok', false, 'error', 'Answer each question, then send it again.');
  end if;

  insert into public.tour_evaluations (first_name, last_name, email, phone, gender, answers, fit)
  values (first_name, last_name, email, phone, gender, p_answers, coalesce(p_fit, false))
  returning id into new_id;

  return jsonb_build_object('ok', true, 'id', new_id);
end;
$$;

create or replace function public.owner_list_tour_evals(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.house_profiles;
  rows jsonb;
begin
  actor := public._house_actor_from_token(p_token);
  if actor is null or actor.id is null or not public._house_is_house_admin(actor) then
    return jsonb_build_object('ok', false, 'error', 'Not allowed.');
  end if;

  select coalesce(jsonb_agg(to_jsonb(person) order by person."createdAt" desc), '[]'::jsonb)
  into rows
  from (
    select
      e.id,
      e.first_name as "firstName",
      e.last_name as "lastName",
      e.email,
      e.phone,
      e.gender,
      e.fit,
      e.status,
      e.answers,
      e.schedule_token as "scheduleToken",
      (e.tour_request_id is not null) as "tourBooked",
      e.created_at as "createdAt"
    from public.tour_evaluations e
  ) person;

  return jsonb_build_object('ok', true, 'evals', rows);
end;
$$;

create or replace function public.owner_set_tour_eval_status(
  p_token uuid,
  p_id uuid,
  p_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.house_profiles;
  row public.tour_evaluations;
  token text;
begin
  actor := public._house_actor_from_token(p_token);
  if actor is null or actor.id is null or not public._house_is_house_admin(actor) then
    return jsonb_build_object('ok', false, 'error', 'Not allowed.');
  end if;
  if p_status not in ('accepted', 'denied') then
    return jsonb_build_object('ok', false, 'error', 'Choose approve or deny.');
  end if;

  select * into row from public.tour_evaluations where id = p_id;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'That evaluation was not found.');
  end if;
  if row.status = p_status then
    return jsonb_build_object('ok', true, 'unchanged', true);
  end if;
  if row.status <> 'pending' then
    return jsonb_build_object('ok', false, 'error', 'This evaluation was already decided.');
  end if;

  token := row.schedule_token;
  if p_status = 'accepted' and token is null then
    token := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  end if;

  update public.tour_evaluations
  set status = p_status,
      schedule_token = case when p_status = 'accepted' then token else schedule_token end,
      decided_at = now()
  where id = p_id;

  return jsonb_build_object('ok', true, 'unchanged', false);
end;
$$;

create or replace function public.public_get_tour_eval(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  row public.tour_evaluations;
begin
  if p_token is null or p_token !~ '^[a-f0-9]{32,80}$' then
    return jsonb_build_object('ok', false, 'error', 'This link is not active.');
  end if;

  select * into row
  from public.tour_evaluations
  where schedule_token = p_token
    and status = 'accepted';

  if not found then
    return jsonb_build_object('ok', false, 'error', 'This link is not active.');
  end if;

  return jsonb_build_object(
    'ok', true,
    'firstName', row.first_name,
    'lastName', row.last_name,
    'email', row.email,
    'phone', row.phone,
    'gender', row.gender,
    'tourBooked', row.tour_request_id is not null
  );
end;
$$;

create or replace function public.public_attach_tour_eval(p_token text, p_tour_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.tour_evaluations;
begin
  if p_token is null or p_token !~ '^[a-f0-9]{32,80}$' or p_tour_id is null then
    return jsonb_build_object('ok', false, 'error', 'This link is not active.');
  end if;

  select * into row
  from public.tour_evaluations
  where schedule_token = p_token
    and status = 'accepted';

  if not found then
    return jsonb_build_object('ok', false, 'error', 'This link is not active.');
  end if;
  if row.tour_request_id is not null then
    return jsonb_build_object('ok', true);
  end if;

  update public.tour_evaluations
  set tour_request_id = p_tour_id
  where id = row.id
    and tour_request_id is null;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.public_submit_tour_eval(text, text, text, text, text, jsonb, boolean) from public;
revoke all on function public.owner_list_tour_evals(uuid) from public;
revoke all on function public.owner_set_tour_eval_status(uuid, uuid, text) from public;
revoke all on function public.public_get_tour_eval(text) from public;
revoke all on function public.public_attach_tour_eval(text, uuid) from public;

grant execute on function public.public_submit_tour_eval(text, text, text, text, text, jsonb, boolean) to anon, authenticated;
grant execute on function public.owner_list_tour_evals(uuid) to anon, authenticated;
grant execute on function public.owner_set_tour_eval_status(uuid, uuid, text) to anon, authenticated;
grant execute on function public.public_get_tour_eval(text) to anon, authenticated;
grant execute on function public.public_attach_tour_eval(text, uuid) to anon, authenticated;
