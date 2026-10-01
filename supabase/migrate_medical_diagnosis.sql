-- Written medical diagnosis on apply and refer.
-- Safe to re-run. Run in the Supabase SQL Editor before new submissions.

alter table public.applications add column if not exists medical_diagnosis text;
alter table public.referrals add column if not exists medical_diagnosis text;

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
    'medicare_medicaid', public.forms_clamp_text(row_data ->> 'medicare_medicaid', 16),
    'mental_explanation', public.forms_clamp_text(row_data ->> 'mental_explanation', 400),
    'medical_diagnosis', public.forms_clamp_text(row_data ->> 'medical_diagnosis', 400)
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
