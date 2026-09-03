"use client";

import { useState, type FormEvent } from "react";
import { submitApplication } from "@/app/actions/forms";
import { trackGoogleAdsContactConversion } from "@/lib/google-ads";
import {
  BENEFIT_OPTIONS,
  GENDER_OPTIONS,
  MOVE_TIMELINE_OPTIONS,
  PAYEE_OPTIONS,
  ROOMMATE_OPTIONS,
  YES_NO,
} from "@/lib/residency-fields";
import OnboardingShell from "./OnboardingShell";
import BenefitsFormLink from "./BenefitsFormLink";
import { NavButtons, RadioGroup, YesNoExplain } from "./FieldHelpers";

type Status = "idle" | "submitting" | "success" | "error";

const STEPS = [
  "About you",
  "Benefits & timing",
  "Your situation",
  "Health & support",
  "Background",
  "Commitments",
  "Emergency contact",
] as const;

const initial = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  gender: "",
  date_of_birth: "",
  benefit_type: "",
  income_source: "",
  monthly_benefit_amount: "",
  move_timeline: "",
  how_heard: "",
  situation_explanation: "",
  living_with_others: "",
  referring_party_info: "",
  mobility_limitations: "",
  mobility_explanation: "",
  mental_limitations: "",
  mental_explanation: "",
  medications_independent: "",
  medical_prescriptions: "",
  medical_explanation: "",
  crime_conviction: "",
  crime_explanation: "",
  drug_free_commitment: "",
  value_understanding: "",
  home_not_short_term: "",
  payee_agreement: "",
  roommate_commitment: "",
  emergency_contact: "",
};

export default function ApplyWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function setField<K extends keyof typeof initial>(key: K, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep(): string | null {
    if (step === 0) {
      if (!data.first_name || !data.last_name || !data.phone || !data.email || !data.gender || !data.date_of_birth) {
        return "Please complete all fields on this step.";
      }
    }
    if (step === 1) {
      if (!data.benefit_type || !data.monthly_benefit_amount || !data.move_timeline || !data.how_heard) {
        return "Please complete all fields on this step.";
      }
      if (data.benefit_type === "Other" && !data.income_source) {
        return "Please tell us how you are receiving income.";
      }
    }
    if (step === 2) {
      if (!data.situation_explanation || !data.living_with_others || !data.referring_party_info) {
        return "Please complete all fields on this step.";
      }
    }
    if (step === 3) {
      if (
        !data.mobility_limitations ||
        !data.mental_limitations ||
        !data.medications_independent ||
        !data.medical_prescriptions
      ) {
        return "Please complete all fields on this step.";
      }
      if (data.mobility_limitations === "Yes" && !data.mobility_explanation) {
        return "Please explain your mobility limitations.";
      }
      if (data.mental_limitations === "Yes" && !data.mental_explanation) {
        return "Please explain your mental limitations.";
      }
      if (data.medical_prescriptions === "Yes" && !data.medical_explanation) {
        return "Please explain your medical prescriptions/diagnosis.";
      }
    }
    if (step === 4) {
      if (!data.crime_conviction) return "Please answer the conviction question.";
      if (data.crime_conviction === "Yes" && !data.crime_explanation) {
        return "Please explain the conviction.";
      }
    }
    if (step === 5) {
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

    const result = await submitApplication(formData);
    if (result.ok) {
      trackGoogleAdsContactConversion();
      setStatus("success");
    } else {
      setStatus("error");
      setError(result.error || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <OnboardingShell title="Application received" subtitle="You're all set" step={STEPS.length - 1} totalSteps={STEPS.length}>
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
    <OnboardingShell
      title={STEPS[step]}
      subtitle="Apply for yourself"
      step={step}
      totalSteps={STEPS.length}
    >
      <form onSubmit={handleContinue}>
        {step === 0 && (
          <>
            <div className="field-row">
              <div className="field">
                <label htmlFor="first_name">First name</label>
                <input
                  id="first_name"
                  required
                  value={data.first_name}
                  onChange={(e) => setField("first_name", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="last_name">Last name</label>
                <input
                  id="last_name"
                  required
                  value={data.last_name}
                  onChange={(e) => setField("last_name", e.target.value)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={data.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="text"
                  required
                  value={data.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="date_of_birth">Date of birth</label>
                <input
                  id="date_of_birth"
                  type="date"
                  required
                  value={data.date_of_birth}
                  onChange={(e) => setField("date_of_birth", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="gender">Gender</label>
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

        {step === 1 && (
          <>
            <RadioGroup
              name="benefit_type"
              label="Benefit type"
              options={BENEFIT_OPTIONS}
              value={data.benefit_type}
              onChange={(v) => {
                setField("benefit_type", v);
                if (v !== "Other") setField("income_source", "");
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
                How much are you receiving from your benefits monthly?
              </label>
              <input
                id="monthly_benefit_amount"
                required
                placeholder="e.g. $943"
                value={data.monthly_benefit_amount}
                onChange={(e) => setField("monthly_benefit_amount", e.target.value)}
              />
            </div>
            <RadioGroup
              name="move_timeline"
              label="How soon are you looking to move into one of our homes?"
              options={MOVE_TIMELINE_OPTIONS}
              value={data.move_timeline}
              onChange={(v) => setField("move_timeline", v)}
            />
            <div className="field">
              <label htmlFor="how_heard">Please state how you heard about us</label>
              <input
                id="how_heard"
                required
                value={data.how_heard}
                onChange={(e) => setField("how_heard", e.target.value)}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="field">
              <label htmlFor="situation_explanation">
                Please give us a quick explanation of your current situation
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
              <label htmlFor="living_with_others">
                Are you applying for yourself only, or will others be living with you?
              </label>
              <input
                id="living_with_others"
                required
                value={data.living_with_others}
                onChange={(e) => setField("living_with_others", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="referring_party_info">
                If this is a referral, please state the referring party, phone number, and
                organization. (Type N/A if none)
              </label>
              <textarea
                id="referring_party_info"
                rows={3}
                required
                value={data.referring_party_info}
                onChange={(e) => setField("referring_party_info", e.target.value)}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <YesNoExplain
              name="mobility_limitations"
              label="Do you have any mobility limitations?"
              value={data.mobility_limitations}
              explainValue={data.mobility_explanation}
              onChange={(v) => setField("mobility_limitations", v)}
              onExplainChange={(v) => setField("mobility_explanation", v)}
            />
            <YesNoExplain
              name="mental_limitations"
              label="Do you have any mental limitations?"
              value={data.mental_limitations}
              explainValue={data.mental_explanation}
              onChange={(v) => setField("mental_limitations", v)}
              onExplainChange={(v) => setField("mental_explanation", v)}
            />
            <RadioGroup
              name="medications_independent"
              label="Do you manage medications independently?"
              options={YES_NO}
              value={data.medications_independent}
              onChange={(v) => setField("medications_independent", v)}
            />
            <YesNoExplain
              name="medical_prescriptions"
              label="Do you have any medical prescriptions/diagnosis?"
              value={data.medical_prescriptions}
              explainValue={data.medical_explanation}
              onChange={(v) => setField("medical_prescriptions", v)}
              onExplainChange={(v) => setField("medical_explanation", v)}
            />
          </>
        )}

        {step === 4 && (
          <YesNoExplain
            name="crime_conviction"
            label="Have you been convicted of a crime within the past 7 years?"
            value={data.crime_conviction}
            explainValue={data.crime_explanation}
            onChange={(v) => setField("crime_conviction", v)}
            onExplainChange={(v) => setField("crime_explanation", v)}
          />
        )}

        {step === 5 && (
          <>
            <RadioGroup
              name="drug_free_commitment"
              label="Our home is a drug and alcohol free environment. All residents agree to a drug-free lifestyle as a condition of housing. Are you able to commit to that? Please note that random drug testing is part of the house rules, and you may be subject to it."
              options={YES_NO}
              value={data.drug_free_commitment}
              onChange={(v) => setField("drug_free_commitment", v)}
            />
            <RadioGroup
              name="value_understanding"
              label="Do you understand that at just $25 a day, New Creation Living provides you a home with more value than any other housing solution/shelter? The average motel is $60 a night, which is $1,800 a month, not including all-inclusive options. Though homeless shelters are resourceful, they cost you safety, stability, and security. It is NOT a home. Is $25 a day too much to ask to receive peace, stability, and a better quality of life?"
              options={YES_NO}
              value={data.value_understanding}
              onChange={(v) => setField("value_understanding", v)}
            />
            <RadioGroup
              name="home_not_short_term"
              label="Do you understand that this is a home and not short-term housing?"
              options={YES_NO}
              value={data.home_not_short_term}
              onChange={(v) => setField("home_not_short_term", v)}
            />
            <div className="field onboarding-callout">
              <p>
                At New Creation Living, we are a registered Georgia business and an approved
                representative payee through the Social Security Administration. To support your
                long-term stability, we receive your monthly benefit on your behalf, cover your
                housing, and return what&apos;s left directly to you — so your home is always secure,
                your money is always accounted for, and you never have to worry about losing your
                housing over a missed payment.
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
                Yes, you&apos;ll share the home but you&apos;ll have your own bed, personal door code,
                privacy, and clear house rules, alongside a small group of vetted adults who have
                passed background checks.
              </p>
              <p>
                Our in-house management creates the structure, safety, and accountability that make
                shared living feel like a real home—not a chaotic roommate situation.
              </p>
              <p>
                For $25 a day, invest in your security, dignity, and future.
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

        {step === 6 && (
          <>
            <div className="field">
              <label htmlFor="emergency_contact">
                Emergency contact (optional — type N/A if you do not have one)
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
              Almost done. Submit your application and our team will follow up within a few hours
              during business hours.
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
          nextLabel={step === STEPS.length - 1 ? "Submit Application" : "Continue"}
          submitting={status === "submitting"}
        />
      </form>
    </OnboardingShell>
  );
}
