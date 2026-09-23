"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { submitReferral } from "@/app/actions/forms";
import { trackGoogleAdsContactConversion } from "@/lib/google-ads";
import { trackMetaLead } from "@/lib/meta-pixel";
import {
  BENEFIT_OPTIONS,
  GENDER_OPTIONS,
  HOW_HEARD_OPTIONS,
  MOVE_TIMELINE_OPTIONS,
  PAYEE_OPTIONS,
  REFERRER_ROLES,
  ROOMMATE_OPTIONS,
  YES_NO,
} from "@/lib/residency-fields";
import OnboardingShell from "./OnboardingShell";
import BenefitsFormLink from "./BenefitsFormLink";
import { NavButtons, RadioGroup, YesNoExplain } from "./FieldHelpers";

type Status = "idle" | "submitting" | "success" | "error";

const STEPS = [
  "About you",
  "About the referee",
  "Benefits & timing",
  "Referee's situation",
  "Health & support",
  "Background",
  "Commitments",
  "Emergency contact",
] as const;

const initial = {
  referrer_name: "",
  referrer_role: "",
  organization: "",
  phone: "",
  email: "",
  referee_first_name: "",
  referee_last_name: "",
  referee_phone: "",
  referee_email: "",
  gender: "",
  date_of_birth: "",
  benefit_type: "",
  medicare_medicaid: "",
  income_source: "",
  monthly_benefit_amount: "",
  move_timeline: "",
  how_heard: "",
  how_heard_other: "",
  promo_code: "",
  situation_explanation: "",
  former_address: "",
  former_contact: "",
  living_with_others: "",
  mobility_limitations: "",
  mobility_explanation: "",
  mental_limitations: "",
  mental_explanation: "",
  has_care_provider: "",
  care_provider_name: "",
  care_provider_phone: "",
  care_provider_address: "",
  medications_independent: "",
  medical_prescriptions: "",
  medical_explanation: "",
  crime_conviction: "",
  crime_explanation: "",
  substance_abuse_history: "",
  substance_abuse_explanation: "",
  aggression_history: "",
  elopement_risk: "",
  communal_living_interference: "",
  drug_free_commitment: "",
  value_understanding: "",
  home_not_short_term: "",
  payee_agreement: "",
  roommate_commitment: "",
  emergency_contact: "",
};

export default function ReferWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function setField<K extends keyof typeof initial>(key: K, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep(): string | null {
    if (step === 0) {
      if (!data.referrer_name || !data.referrer_role || !data.phone || !data.email) {
        return "Please complete all required referrer fields.";
      }
    }
    if (step === 1) {
      if (
        !data.referee_first_name ||
        !data.referee_last_name ||
        !data.gender ||
        !data.date_of_birth
      ) {
        return "Please complete the referee's required fields.";
      }
    }
    if (step === 2) {
      if (!data.benefit_type || !data.monthly_benefit_amount || !data.move_timeline || !data.how_heard) {
        return "Please complete all fields on this step.";
      }
      if (data.benefit_type === "Other" && !data.income_source) {
        return "Please tell us how the referee is receiving income.";
      }
      if (data.how_heard === "Other" && !data.how_heard_other.trim()) {
        return "Please tell us how you heard about us.";
      }
      if (
        ["SSI", "SSDI", "Social Security"].includes(data.benefit_type) &&
        !data.medicare_medicaid
      ) {
        return "Please answer the Medicare or Medicaid question.";
      }
    }
    if (step === 3) {
      if (!data.situation_explanation || !data.living_with_others) {
        return "Please complete all fields on this step.";
      }
      if (!data.former_address.trim() || !data.former_contact.trim()) {
        return "Please share the most recent address and a contact there.";
      }
    }
    if (step === 4) {
      if (
        !data.mobility_limitations ||
        !data.mental_limitations ||
        !data.medications_independent ||
        !data.medical_prescriptions
      ) {
        return "Please complete all fields on this step.";
      }
      if (data.mobility_limitations === "Yes" && !data.mobility_explanation) {
        return "Please explain the mobility issues.";
      }
      if (data.mental_limitations === "Yes" && !data.mental_explanation) {
        return "Please explain the mental diagnosis.";
      }
      if (data.mental_limitations === "Yes" && !data.has_care_provider) {
        return "Please say whether the referee has a therapist or doctor.";
      }
      if (
        data.has_care_provider === "Yes" &&
        (!data.care_provider_name.trim() ||
          !data.care_provider_phone.trim() ||
          !data.care_provider_address.trim())
      ) {
        return "Please share the therapist or doctor's name, phone number, and address.";
      }
      if (data.medical_prescriptions === "Yes" && !data.medical_explanation) {
        return "Please explain medical prescriptions/diagnosis.";
      }
    }
    if (step === 5) {
      if (!data.crime_conviction) return "Please answer the conviction question.";
      if (data.crime_conviction === "Yes" && !data.crime_explanation) {
        return "Please explain the conviction.";
      }
      if (!data.substance_abuse_history) return "Please answer the drug or alcohol abuse question.";
      if (data.substance_abuse_history === "Yes" && !data.substance_abuse_explanation) {
        return "Please explain the drug or alcohol abuse history.";
      }
      if (
        !data.aggression_history ||
        !data.elopement_risk ||
        !data.communal_living_interference
      ) {
        return "Please answer all behavior questions.";
      }
    }
    if (step === 6) {
      if (
        !data.drug_free_commitment ||
        !data.value_understanding ||
        !data.home_not_short_term ||
        !data.payee_agreement ||
        !data.roommate_commitment
      ) {
        return "Please complete all commitment questions.";
      }
    }
    return null;
  }

  async function handleContinue(e: FormEvent) {
    e.preventDefault();
    setError("");
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    setStatus("submitting");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.set(key, value));

    const result = await submitReferral(formData);
    if (result.ok) {
      trackGoogleAdsContactConversion();
      trackMetaLead("Referral");
      setStatus("success");
    } else {
      setStatus("error");
      setError(result.error || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <OnboardingShell
        title="Referral received"
        subtitle="You're all set"
        step={STEPS.length - 1}
        totalSteps={STEPS.length}
      >
        <div className="confirm-box show" style={{ display: "block" }}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </svg>
          <h4>Thank you</h4>
          <p>
            Our team will follow up shortly. For anything urgent, call (404) 731-2371.
          </p>
          <a href="/#apply-options" className="btn btn-primary" style={{ marginTop: 20 }}>
            Back to site
          </a>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell title={STEPS[step]} subtitle="Referral" step={step} totalSteps={STEPS.length}>
      <form onSubmit={handleContinue}>
        {step === 0 && (
          <>
            <div className="field">
              <label htmlFor="referrer_name">Your name</label>
              <input
                id="referrer_name"
                required
                value={data.referrer_name}
                onChange={(e) => setField("referrer_name", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="referrer_role">Your role</label>
              <select
                id="referrer_role"
                required
                value={data.referrer_role}
                onChange={(e) => setField("referrer_role", e.target.value)}
              >
                <option value="">Select one</option>
                {REFERRER_ROLES.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="organization">Organization (if applicable)</label>
                <input
                  id="organization"
                  value={data.organization}
                  onChange={(e) => setField("organization", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Your phone number</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={data.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="email">Your email address</label>
              <input
                id="email"
                type="text"
                required
                value={data.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="field-row">
              <div className="field">
                <label htmlFor="referee_first_name">Referee first name</label>
                <input
                  id="referee_first_name"
                  required
                  value={data.referee_first_name}
                  onChange={(e) => setField("referee_first_name", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="referee_last_name">Referee last name</label>
                <input
                  id="referee_last_name"
                  required
                  value={data.referee_last_name}
                  onChange={(e) => setField("referee_last_name", e.target.value)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="referee_phone">Referee phone (if known)</label>
                <input
                  id="referee_phone"
                  type="tel"
                  value={data.referee_phone}
                  onChange={(e) => setField("referee_phone", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="referee_email">Referee email (if known)</label>
                <input
                  id="referee_email"
                  type="text"
                  value={data.referee_email}
                  onChange={(e) => setField("referee_email", e.target.value)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="date_of_birth">Referee date of birth</label>
                <input
                  id="date_of_birth"
                  type="date"
                  required
                  value={data.date_of_birth}
                  onChange={(e) => setField("date_of_birth", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="gender">Referee gender</label>
                <select
                  id="gender"
                  required
                  value={data.gender}
                  onChange={(e) => setField("gender", e.target.value)}
                >
                  <option value="">Select one</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <RadioGroup
              name="benefit_type"
              label="Referee's benefit type"
              options={BENEFIT_OPTIONS}
              value={data.benefit_type}
              onChange={(v) => {
                setField("benefit_type", v);
                if (v !== "Other") setField("income_source", "");
                if (!["SSI", "SSDI", "Social Security"].includes(v)) setField("medicare_medicaid", "");
              }}
            />
            {data.benefit_type === "Other" && (
              <div className="field">
                <label htmlFor="income_source">How are you receiving income?</label>
                <input
                  id="income_source"
                  required
                  value={data.income_source}
                  onChange={(e) => setField("income_source", e.target.value)}
                />
              </div>
            )}
            {data.benefit_type === "Not yet approved" && <BenefitsFormLink />}
            <div className="field">
              <label htmlFor="monthly_benefit_amount">
                How much is the referee receiving from benefits monthly?
              </label>
              <input
                id="monthly_benefit_amount"
                required
                placeholder="e.g. $943"
                value={data.monthly_benefit_amount}
                onChange={(e) => setField("monthly_benefit_amount", e.target.value)}
              />
            </div>
            {["SSI", "SSDI", "Social Security"].includes(data.benefit_type) && (
              <RadioGroup
                name="medicare_medicaid"
                label="Does the referee have Medicare or Medicaid?"
                options={YES_NO}
                value={data.medicare_medicaid}
                onChange={(v) => setField("medicare_medicaid", v)}
              />
            )}
            <RadioGroup
              name="move_timeline"
              label="How soon is the referee looking to move in?"
              options={MOVE_TIMELINE_OPTIONS}
              value={data.move_timeline}
              onChange={(v) => setField("move_timeline", v)}
            />
            <div className="field">
              <label htmlFor="how_heard">How did you hear about us?</label>
              <select
                id="how_heard"
                required
                value={data.how_heard}
                onChange={(e) => {
                  setField("how_heard", e.target.value);
                  if (e.target.value !== "Other") setField("how_heard_other", "");
                }}
              >
                <option value="">Select one</option>
                {HOW_HEARD_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {data.how_heard === "Other" && (
              <div className="field">
                <label htmlFor="how_heard_other">Please tell us how you heard about us</label>
                <input
                  id="how_heard_other"
                  required
                  placeholder="e.g. flyer, church, TikTok"
                  value={data.how_heard_other}
                  onChange={(e) => setField("how_heard_other", e.target.value)}
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="promo_code">Promo code (optional)</label>
              <input
                id="promo_code"
                value={data.promo_code}
                onChange={(e) => setField("promo_code", e.target.value)}
                placeholder="From an event or flyer"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="field">
              <label htmlFor="situation_explanation">
                Please give us a quick explanation of the referee&apos;s current situation
              </label>
              <textarea
                id="situation_explanation"
                rows={4}
                required
                value={data.situation_explanation}
                onChange={(e) => setField("situation_explanation", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="former_address">Most recent address</label>
              <textarea
                id="former_address"
                rows={2}
                required
                value={data.former_address}
                onChange={(e) => setField("former_address", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="former_contact">A contact at that address (name and phone)</label>
              <input
                id="former_contact"
                required
                value={data.former_contact}
                onChange={(e) => setField("former_contact", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="living_with_others">
                Is the individual applying for themselves only, or will others be living with them?
              </label>
              <input
                id="living_with_others"
                required
                value={data.living_with_others}
                onChange={(e) => setField("living_with_others", e.target.value)}
              />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <YesNoExplain
              name="mobility_limitations"
              label="Does the referee have any mobility issues?"
              value={data.mobility_limitations}
              explainValue={data.mobility_explanation}
              onChange={(v) => setField("mobility_limitations", v)}
              onExplainChange={(v) => setField("mobility_explanation", v)}
            />
            <YesNoExplain
              name="mental_limitations"
              label="Does the referee have a mental diagnosis?"
              value={data.mental_limitations}
              explainValue={data.mental_explanation}
              onChange={(v) => {
                setField("mental_limitations", v);
                if (v !== "Yes") {
                  setField("has_care_provider", "");
                  setField("care_provider_name", "");
                  setField("care_provider_phone", "");
                  setField("care_provider_address", "");
                }
              }}
              onExplainChange={(v) => setField("mental_explanation", v)}
            />
            {data.mental_limitations === "Yes" && (
              <>
                <RadioGroup
                  name="has_care_provider"
                  label="Does the referee have a therapist or doctor?"
                  options={YES_NO}
                  value={data.has_care_provider}
                  onChange={(v) => {
                    setField("has_care_provider", v);
                    if (v !== "Yes") {
                      setField("care_provider_name", "");
                      setField("care_provider_phone", "");
                      setField("care_provider_address", "");
                    }
                  }}
                />
                {data.has_care_provider === "Yes" && (
                  <>
                    <div className="field">
                      <label htmlFor="care_provider_name">Therapist or doctor name</label>
                      <input
                        id="care_provider_name"
                        required
                        value={data.care_provider_name}
                        onChange={(e) => setField("care_provider_name", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="care_provider_phone">Therapist or doctor phone number</label>
                      <input
                        id="care_provider_phone"
                        type="tel"
                        required
                        value={data.care_provider_phone}
                        onChange={(e) => setField("care_provider_phone", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="care_provider_address">Therapist or doctor address</label>
                      <textarea
                        id="care_provider_address"
                        rows={2}
                        required
                        value={data.care_provider_address}
                        onChange={(e) => setField("care_provider_address", e.target.value)}
                      />
                    </div>
                  </>
                )}
              </>
            )}
            <RadioGroup
              name="medications_independent"
              label="Does the referee manage medications independently?"
              options={YES_NO}
              value={data.medications_independent}
              onChange={(v) => setField("medications_independent", v)}
            />
            <YesNoExplain
              name="medical_prescriptions"
              label="Does the referee have any medical prescriptions/diagnosis?"
              value={data.medical_prescriptions}
              explainValue={data.medical_explanation}
              onChange={(v) => setField("medical_prescriptions", v)}
              onExplainChange={(v) => setField("medical_explanation", v)}
            />
          </>
        )}

        {step === 5 && (
          <>
            <YesNoExplain
              name="crime_conviction"
              label="Has the referee been convicted of a crime within the past 7 years?"
              value={data.crime_conviction}
              explainValue={data.crime_explanation}
              onChange={(v) => setField("crime_conviction", v)}
              onExplainChange={(v) => setField("crime_explanation", v)}
            />
            <YesNoExplain
              name="substance_abuse_history"
              label="Has the referee had a history of drug or alcohol abuse?"
              value={data.substance_abuse_history}
              explainValue={data.substance_abuse_explanation}
              onChange={(v) => setField("substance_abuse_history", v)}
              onExplainChange={(v) => setField("substance_abuse_explanation", v)}
            />
            <RadioGroup
              name="aggression_history"
              label="Have they had any history of Aggression?"
              options={YES_NO}
              value={data.aggression_history}
              onChange={(v) => setField("aggression_history", v)}
            />
            <RadioGroup
              name="elopement_risk"
              label="Do they have any elopement (wandering) risk?"
              options={YES_NO}
              value={data.elopement_risk}
              onChange={(v) => setField("elopement_risk", v)}
            />
            <RadioGroup
              name="communal_living_interference"
              label="Have they shown any behaviors that would interfere with communal living?"
              options={YES_NO}
              value={data.communal_living_interference}
              onChange={(v) => setField("communal_living_interference", v)}
            />
          </>
        )}

        {step === 6 && (
          <>
            <RadioGroup
              name="drug_free_commitment"
              label="Our home is a drug and alcohol free environment. Is the referee able to commit to a drug-free lifestyle? Random drug testing is part of house rules."
              options={YES_NO}
              value={data.drug_free_commitment}
              onChange={(v) => setField("drug_free_commitment", v)}
            />
            <RadioGroup
              name="value_understanding"
              label="Does the referee understand that at $25 a day, New Creation Living provides more value than a motel (~$1,800/month) or shelter — a real home with peace and stability?"
              options={YES_NO}
              value={data.value_understanding}
              onChange={(v) => setField("value_understanding", v)}
            />
            <RadioGroup
              name="home_not_short_term"
              label="Does the referee understand that this is a home and not short-term housing?"
              options={YES_NO}
              value={data.home_not_short_term}
              onChange={(v) => setField("home_not_short_term", v)}
            />
            <div className="field onboarding-callout">
              <p>
                We are an approved representative payee through the Social Security Administration.
                We receive the monthly benefit on the referee&apos;s behalf, cover housing, and return
                what&apos;s left so their home stays secure.
              </p>
            </div>
            <RadioGroup
              name="payee_agreement"
              label="Representative payee agreement"
              options={PAYEE_OPTIONS}
              value={data.payee_agreement}
              onChange={(v) => setField("payee_agreement", v)}
            />
            <div className="field onboarding-callout">
              <p>
                Yes, they&apos;ll share the home but they&apos;ll have their own bed, personal door code,
                privacy, and clear house rules, alongside a small group of vetted adults who have
                passed background checks.
              </p>
              <p>
                Our in-house management creates the structure, safety, and accountability that make
                shared living feel like a real home—not a chaotic roommate situation.
              </p>
              <p>
                For $25 a day, invest in their security, dignity, and future.
              </p>
            </div>
            <RadioGroup
              name="roommate_commitment"
              label="Roommate-style housing commitment"
              options={ROOMMATE_OPTIONS}
              value={data.roommate_commitment}
              onChange={(v) => setField("roommate_commitment", v)}
            />
          </>
        )}

        {step === 7 && (
          <>
            <div className="field">
              <label htmlFor="emergency_contact">
                Emergency contact (optional — type N/A if none)
              </label>
              <textarea
                id="emergency_contact"
                rows={3}
                placeholder="Name, phone, relationship — or N/A"
                value={data.emergency_contact}
                onChange={(e) => setField("emergency_contact", e.target.value)}
              />
            </div>
            <p className="form-note">
              Submit this referral and our team will follow up within a few hours during business
              hours. We use this information to review housing fit as described in our{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </>
        )}

        {error && (
          <p className="form-note" style={{ color: "#C0392B" }}>
            {error}
          </p>
        )}

        <NavButtons
          showBack={step > 0}
          onBack={() => {
            setError("");
            setStep((s) => s - 1);
          }}
          nextLabel={step === STEPS.length - 1 ? "Submit Referral" : "Continue"}
          submitting={status === "submitting"}
        />
      </form>
    </OnboardingShell>
  );
}
