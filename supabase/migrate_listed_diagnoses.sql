-- Listed diagnoses from the website apply and referral forms.
-- Safe to re-run. Adds the column, then includes it on the resident Care card.
-- Inbox already returns new columns through to_jsonb.

alter table public.applications
  add column if not exists listed_diagnoses text[] not null default '{}';

alter table public.referrals
  add column if not exists listed_diagnoses text[] not null default '{}';

create or replace function public.house_resident_intake(p_token uuid, p_resident_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor public.house_profiles;
  resident public.house_profiles;
  intake jsonb;
begin
  actor := public._house_actor_from_token(p_token);
  if actor is null or actor.id is null or not public._house_is_ops(actor) then
    return jsonb_build_object('ok', false, 'error', 'Not allowed.');
  end if;

  if p_resident_id is null or p_resident_id !~ '^[a-z0-9][a-z0-9-]{0,63}$' then
    return jsonb_build_object('ok', false, 'error', 'Resident not found.');
  end if;

  select * into resident
  from public.house_profiles
  where id = p_resident_id
    and role = 'resident';

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Resident not found.');
  end if;

  if actor.role = 'house_manager' and resident.manager_id is distinct from actor.id then
    return jsonb_build_object('ok', false, 'error', 'Not allowed.');
  end if;

  if resident.source_kind is null or resident.source_id is null then
    return jsonb_build_object('ok', true, 'kind', null, 'intake', null);
  end if;

  if resident.source_kind = 'application' then
    select jsonb_build_object(
      'kind', 'application',
      'phone', a.phone,
      'email', a.email,
      'gender', a.gender,
      'date_of_birth', a.date_of_birth,
      'benefit_type', a.benefit_type,
      'monthly_benefit_amount', a.monthly_benefit_amount,
      'medicare_medicaid', a.medicare_medicaid,
      'situation_explanation', a.situation_explanation,
      'former_address', a.former_address,
      'former_contact', a.former_contact,
      'promo_code', a.promo_code,
      'mobility_limitations', a.mobility_limitations,
      'mobility_explanation', a.mobility_explanation,
      'mental_limitations', a.mental_limitations,
      'mental_explanation', a.mental_explanation,
      'listed_diagnoses', a.listed_diagnoses,
      'has_care_provider', a.has_care_provider,
      'care_provider_name', a.care_provider_name,
      'care_provider_phone', a.care_provider_phone,
      'care_provider_address', a.care_provider_address,
      'medications_independent', a.medications_independent,
      'medical_prescriptions', a.medical_prescriptions,
      'medical_explanation', a.medical_explanation,
      'crime_conviction', a.crime_conviction,
      'crime_explanation', a.crime_explanation,
      'substance_abuse_history', a.substance_abuse_history,
      'drug_free_commitment', a.drug_free_commitment,
      'living_with_others', a.living_with_others,
      'dependents_kind', a.dependents_kind,
      'dependent_name', a.dependent_name,
      'dependent_income', a.dependent_income,
      'memory_loss', a.memory_loss,
      'roommate_commitment', a.roommate_commitment,
      'home_not_short_term', a.home_not_short_term,
      'payee_agreement', a.payee_agreement,
      'emergency_contact', a.emergency_contact,
      'move_timeline', a.move_timeline
    )
    into intake
    from public.applications a
    where a.id = resident.source_id;
  else
    select jsonb_build_object(
      'kind', 'referral',
      'phone', coalesce(r.referee_phone, r.phone),
      'email', coalesce(r.referee_email, r.email),
      'gender', r.gender,
      'date_of_birth', r.date_of_birth,
      'benefit_type', r.benefit_type,
      'monthly_benefit_amount', r.monthly_benefit_amount,
      'medicare_medicaid', r.medicare_medicaid,
      'situation_explanation', r.situation_explanation,
      'former_address', r.former_address,
      'former_contact', r.former_contact,
      'promo_code', r.promo_code,
      'mobility_limitations', r.mobility_limitations,
      'mobility_explanation', r.mobility_explanation,
      'mental_limitations', r.mental_limitations,
      'mental_explanation', r.mental_explanation,
      'listed_diagnoses', r.listed_diagnoses,
      'has_care_provider', r.has_care_provider,
      'care_provider_name', r.care_provider_name,
      'care_provider_phone', r.care_provider_phone,
      'care_provider_address', r.care_provider_address,
      'medications_independent', r.medications_independent,
      'medical_prescriptions', r.medical_prescriptions,
      'medical_explanation', r.medical_explanation,
      'crime_conviction', r.crime_conviction,
      'crime_explanation', r.crime_explanation,
      'substance_abuse_history', r.substance_abuse_history,
      'drug_free_commitment', r.drug_free_commitment,
      'living_with_others', r.living_with_others,
      'dependents_kind', r.dependents_kind,
      'dependent_name', r.dependent_name,
      'dependent_income', r.dependent_income,
      'memory_loss', r.memory_loss,
      'roommate_commitment', r.roommate_commitment,
      'home_not_short_term', r.home_not_short_term,
      'payee_agreement', r.payee_agreement,
      'emergency_contact', r.emergency_contact,
      'move_timeline', r.move_timeline,
      'aggression_history', r.aggression_history,
      'elopement_risk', r.elopement_risk,
      'communal_living_interference', r.communal_living_interference
    )
    into intake
    from public.referrals r
    where r.id = resident.source_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'kind', resident.source_kind,
    'intake', intake
  );
exception
  when undefined_table then
    return jsonb_build_object('ok', false, 'error', 'Application tables are missing in this database.');
  when undefined_column then
    return jsonb_build_object('ok', false, 'error', 'Application columns are missing in this database.');
end;
$$;
