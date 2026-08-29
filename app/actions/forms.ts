"use server";

import { createClient } from "@supabase/supabase-js";
import { scoreApplication, scoreReferral } from "@/lib/favorability-score";
import { notifyNewSubmission } from "@/lib/notify";

export type FormActionResult =
  | { ok: true }
  | { ok: false; error: string };

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  return createClient(url, anonKey);
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function answer(value: string | null | undefined): string {
  const trimmed = (value || "").trim();
  return trimmed || "—";
}

function requireYesExplain(
  answer: string,
  explanation: string,
  label: string
): string | null {
  if (answer === "Yes" && !explanation) {
    return `Please explain for: ${label}`;
  }
  return null;
}

export async function submitApplication(formData: FormData): Promise<FormActionResult> {
  const payload = {
    first_name: text(formData, "first_name"),
    last_name: text(formData, "last_name"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    gender: text(formData, "gender"),
    date_of_birth: text(formData, "date_of_birth"),
    benefit_type: text(formData, "benefit_type"),
    situation_explanation: text(formData, "situation_explanation"),
    mobility_limitations: text(formData, "mobility_limitations"),
    mobility_explanation: text(formData, "mobility_explanation"),
    mental_limitations: text(formData, "mental_limitations"),
    mental_explanation: text(formData, "mental_explanation"),
    medications_independent: text(formData, "medications_independent"),
    crime_conviction: text(formData, "crime_conviction"),
    crime_explanation: text(formData, "crime_explanation"),
    monthly_benefit_amount: text(formData, "monthly_benefit_amount"),
    medical_prescriptions: text(formData, "medical_prescriptions"),
    medical_explanation: text(formData, "medical_explanation"),
    drug_free_commitment: text(formData, "drug_free_commitment"),
    value_understanding: text(formData, "value_understanding"),
    living_with_others: text(formData, "living_with_others"),
    home_not_short_term: text(formData, "home_not_short_term"),
    payee_agreement: text(formData, "payee_agreement"),
    roommate_commitment: text(formData, "roommate_commitment"),
    referring_party_info: text(formData, "referring_party_info"),
    how_heard: text(formData, "how_heard"),
    move_timeline: text(formData, "move_timeline"),
    emergency_contact: text(formData, "emergency_contact"),
  };

  const required: (keyof typeof payload)[] = [
    "first_name",
    "last_name",
    "phone",
    "email",
    "gender",
    "date_of_birth",
    "benefit_type",
    "situation_explanation",
    "mobility_limitations",
    "mental_limitations",
    "medications_independent",
    "crime_conviction",
    "monthly_benefit_amount",
    "medical_prescriptions",
    "drug_free_commitment",
    "value_understanding",
    "living_with_others",
    "home_not_short_term",
    "payee_agreement",
    "roommate_commitment",
    "referring_party_info",
    "how_heard",
    "move_timeline",
  ];

  if (required.some((key) => !payload[key])) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  const explainError =
    requireYesExplain(payload.mobility_limitations, payload.mobility_explanation, "mobility limitations") ||
    requireYesExplain(payload.mental_limitations, payload.mental_explanation, "mental limitations") ||
    requireYesExplain(payload.crime_conviction, payload.crime_explanation, "crime conviction") ||
    requireYesExplain(payload.medical_prescriptions, payload.medical_explanation, "medical prescriptions");

  if (explainError) return { ok: false, error: explainError };

  const favorability = scoreApplication(payload);

  try {
    const { error } = await getServerSupabase().from("applications").insert({
      ...payload,
      mobility_explanation: payload.mobility_explanation || null,
      mental_explanation: payload.mental_explanation || null,
      crime_explanation: payload.crime_explanation || null,
      medical_explanation: payload.medical_explanation || null,
      emergency_contact: payload.emergency_contact || null,
      favorability_score: favorability.score,
      favorability_max_score: favorability.max_score,
      favorability_percent: favorability.percent,
      favorability_label: favorability.label,
    });

    if (error) {
      console.error("Application submission failed:", error);
      return { ok: false, error: error.message };
    }

    await notifyNewSubmission({
      kind: "application",
      summary: `${payload.first_name} ${payload.last_name} (${favorability.display})`,
      userEmail: payload.email,
      userName: payload.first_name,
      details: {
        "Favorability score": `${favorability.display} — ${favorability.label}`,
        "First name": payload.first_name,
        "Last name": payload.last_name,
        "Phone number": payload.phone,
        "Email address": payload.email,
        "Date of birth": payload.date_of_birth,
        Gender: payload.gender,
        "Benefit type": payload.benefit_type,
        "How much are you receiving from your benefits monthly?":
          payload.monthly_benefit_amount,
        "How soon are you looking to move into one of our homes?":
          payload.move_timeline,
        "Please state how you heard about us": payload.how_heard,
        "Please give us a quick explanation of your current situation":
          payload.situation_explanation,
        "Are you applying for yourself only, or will others be living with you?":
          payload.living_with_others,
        "If this is a referral, please state the referring party, phone number, and organization":
          payload.referring_party_info,
        "Do you have any mobility limitations?": payload.mobility_limitations,
        "Mobility limitations explanation": answer(payload.mobility_explanation),
        "Do you have any mental limitations?": payload.mental_limitations,
        "Mental limitations explanation": answer(payload.mental_explanation),
        "Do you manage medications independently?":
          payload.medications_independent,
        "Do you have any medical prescriptions/diagnosis?":
          payload.medical_prescriptions,
        "Medical prescriptions/diagnosis explanation": answer(
          payload.medical_explanation
        ),
        "Have you been convicted of a crime within the past 7 years?":
          payload.crime_conviction,
        "Conviction explanation": answer(payload.crime_explanation),
        "Can you commit to a drug- and alcohol-free home? Random drug testing is part of house rules.":
          payload.drug_free_commitment,
        "Do you understand that at $25 a day, NCL provides more value than a motel (~$1,800/month) or shelter — a real home with peace and stability?":
          payload.value_understanding,
        "Do you understand that this is a home and not short-term housing?":
          payload.home_not_short_term,
        "Representative payee agreement": payload.payee_agreement,
        "Roommate-style housing commitment": payload.roommate_commitment,
        "Emergency contact": answer(payload.emergency_contact),
      },
    });

    return { ok: true };
  } catch (err) {
    console.error("Application submission failed:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Submission failed.",
    };
  }
}

export async function submitReferral(formData: FormData): Promise<FormActionResult> {
  const payload = {
    referrer_name: text(formData, "referrer_name"),
    referrer_role: text(formData, "referrer_role"),
    organization: text(formData, "organization"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    referee_first_name: text(formData, "referee_first_name"),
    referee_last_name: text(formData, "referee_last_name"),
    referee_phone: text(formData, "referee_phone"),
    referee_email: text(formData, "referee_email"),
    gender: text(formData, "gender"),
    date_of_birth: text(formData, "date_of_birth"),
    benefit_type: text(formData, "benefit_type"),
    situation_explanation: text(formData, "situation_explanation"),
    mobility_limitations: text(formData, "mobility_limitations"),
    mobility_explanation: text(formData, "mobility_explanation"),
    mental_limitations: text(formData, "mental_limitations"),
    mental_explanation: text(formData, "mental_explanation"),
    medications_independent: text(formData, "medications_independent"),
    crime_conviction: text(formData, "crime_conviction"),
    crime_explanation: text(formData, "crime_explanation"),
    aggression_history: text(formData, "aggression_history"),
    elopement_risk: text(formData, "elopement_risk"),
    communal_living_interference: text(formData, "communal_living_interference"),
    monthly_benefit_amount: text(formData, "monthly_benefit_amount"),
    medical_prescriptions: text(formData, "medical_prescriptions"),
    medical_explanation: text(formData, "medical_explanation"),
    drug_free_commitment: text(formData, "drug_free_commitment"),
    value_understanding: text(formData, "value_understanding"),
    living_with_others: text(formData, "living_with_others"),
    home_not_short_term: text(formData, "home_not_short_term"),
    payee_agreement: text(formData, "payee_agreement"),
    roommate_commitment: text(formData, "roommate_commitment"),
    how_heard: text(formData, "how_heard"),
    move_timeline: text(formData, "move_timeline"),
    emergency_contact: text(formData, "emergency_contact"),
  };

  const required: (keyof typeof payload)[] = [
    "referrer_name",
    "referrer_role",
    "phone",
    "email",
    "referee_first_name",
    "referee_last_name",
    "gender",
    "date_of_birth",
    "benefit_type",
    "situation_explanation",
    "mobility_limitations",
    "mental_limitations",
    "medications_independent",
    "crime_conviction",
    "aggression_history",
    "elopement_risk",
    "communal_living_interference",
    "monthly_benefit_amount",
    "medical_prescriptions",
    "drug_free_commitment",
    "value_understanding",
    "living_with_others",
    "home_not_short_term",
    "payee_agreement",
    "roommate_commitment",
    "how_heard",
    "move_timeline",
  ];

  if (required.some((key) => !payload[key])) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  const explainError =
    requireYesExplain(payload.mobility_limitations, payload.mobility_explanation, "mobility limitations") ||
    requireYesExplain(payload.mental_limitations, payload.mental_explanation, "mental limitations") ||
    requireYesExplain(payload.crime_conviction, payload.crime_explanation, "crime conviction") ||
    requireYesExplain(payload.medical_prescriptions, payload.medical_explanation, "medical prescriptions");

  if (explainError) return { ok: false, error: explainError };

  const favorability = scoreReferral(payload);

  try {
    const { error } = await getServerSupabase().from("referrals").insert({
      ...payload,
      organization: payload.organization || null,
      referee_phone: payload.referee_phone || null,
      referee_email: payload.referee_email || null,
      mobility_explanation: payload.mobility_explanation || null,
      mental_explanation: payload.mental_explanation || null,
      crime_explanation: payload.crime_explanation || null,
      medical_explanation: payload.medical_explanation || null,
      emergency_contact: payload.emergency_contact || null,
      favorability_score: favorability.score,
      favorability_max_score: favorability.max_score,
      favorability_percent: favorability.percent,
      favorability_label: favorability.label,
    });

    if (error) {
      console.error("Referral submission failed:", error);
      return { ok: false, error: error.message };
    }

    await notifyNewSubmission({
      kind: "referral",
      summary: `${payload.referrer_name} referred ${payload.referee_first_name} ${payload.referee_last_name} (${favorability.display})`,
      userEmail: payload.email,
      userName: payload.referrer_name,
      details: {
        "Favorability score": `${favorability.display} — ${favorability.label}`,
        "Referrer name": payload.referrer_name,
        "Referrer role": payload.referrer_role,
        Organization: answer(payload.organization),
        "Referrer phone": payload.phone,
        "Referrer email": payload.email,
        "Referee first name": payload.referee_first_name,
        "Referee last name": payload.referee_last_name,
        "Referee phone": answer(payload.referee_phone),
        "Referee email": answer(payload.referee_email),
        "Referee date of birth": payload.date_of_birth,
        "Referee gender": payload.gender,
        "Referee's benefit type": payload.benefit_type,
        "How much is the referee receiving from benefits monthly?":
          payload.monthly_benefit_amount,
        "How soon is the referee looking to move in?": payload.move_timeline,
        "How did you hear about us?": payload.how_heard,
        "Please give us a quick explanation of the referee's current situation":
          payload.situation_explanation,
        "Is the individual applying for themselves only, or will others be living with them?":
          payload.living_with_others,
        "Does the referee have any mobility limitations?":
          payload.mobility_limitations,
        "Mobility limitations explanation": answer(payload.mobility_explanation),
        "Does the referee have any mental limitations?":
          payload.mental_limitations,
        "Mental limitations explanation": answer(payload.mental_explanation),
        "Does the referee manage medications independently?":
          payload.medications_independent,
        "Does the referee have any medical prescriptions/diagnosis?":
          payload.medical_prescriptions,
        "Medical prescriptions/diagnosis explanation": answer(
          payload.medical_explanation
        ),
        "Has the referee been convicted of a crime within the past 7 years?":
          payload.crime_conviction,
        "Conviction explanation": answer(payload.crime_explanation),
        "Have they had any history of Aggression?": payload.aggression_history,
        "Do they have any elopement (wandering) risk?": payload.elopement_risk,
        "Have they shown any behaviors that would interfere with communal living?":
          payload.communal_living_interference,
        "Is the referee able to commit to a drug- and alcohol-free home? Random drug testing is part of house rules.":
          payload.drug_free_commitment,
        "Does the referee understand that at $25 a day, NCL provides more value than a motel (~$1,800/month) or shelter — a real home with peace and stability?":
          payload.value_understanding,
        "Does the referee understand that this is a home and not short-term housing?":
          payload.home_not_short_term,
        "Representative payee agreement": payload.payee_agreement,
        "Roommate-style housing commitment": payload.roommate_commitment,
        "Emergency contact": answer(payload.emergency_contact),
      },
    });

    return { ok: true };
  } catch (err) {
    console.error("Referral submission failed:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Submission failed.",
    };
  }
}

export async function submitTourRequest(formData: FormData): Promise<FormActionResult> {
  const first_name = text(formData, "tour-first");
  const last_name = text(formData, "tour-last");
  const phone = text(formData, "tour-phone");
  const email = text(formData, "tour-email");
  const preferred_date = text(formData, "tour-date");
  const gender = text(formData, "tour-gender");

  if (!first_name || !last_name || !phone || !email || !preferred_date || !gender) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  try {
    const { error } = await getServerSupabase().from("tour_requests").insert({
      first_name,
      last_name,
      phone,
      email,
      preferred_date,
      gender,
    });

    if (error) {
      console.error("Tour request submission failed:", error);
      return { ok: false, error: error.message };
    }

    await notifyNewSubmission({
      kind: "tour_request",
      summary: `${first_name} ${last_name} — ${preferred_date}`,
      userEmail: email,
      userName: first_name,
      details: {
        "First name": first_name,
        "Last name": last_name,
        "Phone number": phone,
        "Email address": email,
        Gender: gender,
        "Preferred tour date": preferred_date,
      },
    });

    return { ok: true };
  } catch (err) {
    console.error("Tour request submission failed:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Submission failed.",
    };
  }
}

export async function submitBenefitsScreening(
  formData: FormData
): Promise<FormActionResult> {
  const first_name = text(formData, "ben-first");
  const last_name = text(formData, "ben-last");
  const phone = text(formData, "ben-phone");
  const email = text(formData, "ben-email");
  const benefit_type = text(formData, "ben-type");
  const applied_before = text(formData, "ben-applied");
  const notes = text(formData, "ben-notes");
  const served_military = text(formData, "ben-military");
  const disability_12_months = text(formData, "ben-disability");
  const ss_work_history = text(formData, "ben-ss-history");
  const last_worked = text(formData, "ben-last-worked");
  const monthly_income_assets = text(formData, "ben-income-assets");

  if (
    !first_name ||
    !last_name ||
    !phone ||
    !email ||
    !benefit_type ||
    !applied_before ||
    !served_military ||
    !disability_12_months ||
    !ss_work_history ||
    !last_worked ||
    !monthly_income_assets
  ) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  try {
    const { error } = await getServerSupabase().from("benefits_screenings").insert({
      first_name,
      last_name,
      phone,
      email,
      benefit_type,
      applied_before,
      notes: notes || null,
      served_military,
      disability_12_months,
      ss_work_history,
      last_worked,
      monthly_income_assets,
    });

    if (error) {
      console.error("Benefits screening submission failed:", error);
      return { ok: false, error: error.message };
    }

    await notifyNewSubmission({
      kind: "benefits_screening",
      summary: `${first_name} ${last_name}`,
      userEmail: email,
      userName: first_name,
      details: {
        "First name": first_name,
        "Last name": last_name,
        "Phone number": phone,
        "Email address": email,
        "Which benefit are you seeking help with?": benefit_type,
        "Have you ever applied for this benefit in the past?": applied_before,
        "Have you ever served in the U.S. military?": served_military,
        "Do you have a disability or medical condition that prevents you from working, lasting (or expected to last) at least 12 months?":
          disability_12_months,
        "How long have you worked and paid into Social Security?":
          ss_work_history,
        "When was the last time you worked?": last_worked,
        "What is your total monthly income and the rough value of your assets?":
          monthly_income_assets,
        "Briefly describe your situation or health conditions": answer(notes),
      },
    });

    return { ok: true };
  } catch (err) {
    console.error("Benefits screening submission failed:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Submission failed.",
    };
  }
}
