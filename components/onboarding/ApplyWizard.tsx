"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { submitApplication } from "@/app/actions/forms";
import { trackGoogleAdsContactConversion } from "@/lib/google-ads";
import { trackMetaSubmitApplication } from "@/lib/meta-pixel";
import {
  APPLYING_FOR_OPTIONS,
  APPLYING_WITH_DEPENDANTS,
  BENEFIT_OPTIONS,
  DEPENDENT_KIND_OPTIONS,
  DEPENDENTS_ADULTS,
  DEPENDENTS_UNDERAGE,
  GENDER_OPTIONS,
  HOW_HEARD_OPTIONS,
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
  medicare_medicaid: "",
  income_source: "",
  monthly_benefit_amount: "",
  move_timeline: "",
  how_heard: "",
  how_heard_other: "",
  situation_explanation: "",
  former_address: "",
  former_contact: "",
  living_with_others: "",
  dependents_kind: "",
  dependent_name: "",
  dependent_income: "",
  referring_party_info: "",
  mobility_limitations: "",
  mobility_explanation: "",
  mental_limitations: "",
  mental_explanation: "",
  mental_diagnosis: "",
  has_care_provider: "",
  care_provider_contact: "",
  care_provider_address: "",
  medications_independent: "",
  medical_prescriptions: "",
  medical_explanation: "",
  memory_loss: "",
  crime_conviction: "",
  crime_explanation: "",
  substance_abuse_history: "",
  substance_abuse_explanation: "",
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

  const benefitsNotApproved = data.benefit_type === "Not yet approved";
  const applyingWithDependants = data.living_with_others === APPLYING_WITH_DEPENDANTS;
  const dependantsNotAFit = data.dependents_kind === DEPENDENTS_UNDERAGE;

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
      if (data.benefit_type === "Not yet approved") {
        return "You'll need approved benefits before you can apply. Start the benefits screening below.";
      }
      if (!data.benefit_type || !data.monthly_benefit_amount || !data.move_timeline || !data.how_heard) {
        return "Please complete all fields on this step.";
      }
      if (data.benefit_type === "Other" && !data.income_source) {
        return "Please tell us how you are receiving income.";
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
    if (step === 2) {
      if (!data.situation_explanation || !data.living_with_others) {
        return "Please complete all fields on this step.";
      }
      if (!data.former_address.trim() || !data.former_contact.trim()) {
        return "Please share the most recent address and a contact there.";
      }
      if (applyingWithDependants) {
        if (dependantsNotAFit) {
          return "Unfortunately we aren't the best fit for households with underage dependents.";
        }
        if (data.dependents_kind !== DEPENDENTS_ADULTS) {
          return "Please tell us whether the dependants are adults on a fixed income.";
        }
        if (!data.dependent_name || !data.dependent_income) {
          return "Please share the adult dependant's name and how much they receive.";
        }
      }
      if (!data.referring_party_info) {
        return "Please complete all fields on this step.";
      }
    }
    if (step === 3) {
      if (
        !data.mobility_limitations ||
        !data.mental_limitations ||
        !data.medications_independent ||
        !data.medical_prescriptions ||
        !data.memory_loss
      ) {
        return "Please complete all fields on this step.";
      }
      if (data.mobility_limitations === "Yes" && !data.mobility_explanation) {
        return "Please explain your mobility limitations.";
      }
      if (data.mental_limitations === "Yes" && !data.mental_explanation) {
        return "Please explain your mental limitations.";
      }
      if (!data.mental_diagnosis) return "Please answer the mental health diagnosis question.";
      if (data.mental_diagnosis === "Yes" && !data.has_care_provider) {
        return "Please say whether you have a therapist or doctor.";
      }
      if (
        data.has_care_provider === "Yes" &&
        (!data.care_provider_contact.trim() || !data.care_provider_address.trim())
      ) {
        return "Please share your therapist or doctor's contact and address.";
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
      if (!data.substance_abuse_history) return "Please answer the drug or alcohol abuse question.";
      if (data.substance_abuse_history === "Yes" && !data.substance_abuse_explanation) {
        return "Please explain the drug or alcohol abuse history.";
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
      trackMetaSubmitApplication();
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
            {benefitsNotApproved && <BenefitsFormLink />}
            <div
              className={benefitsNotApproved ? "onboarding-locked" : undefined}
              aria-hidden={benefitsNotApproved}
            >
              <div className="field">
                <label htmlFor="monthly_benefit_amount">
                  How much are you receiving from your benefits monthly?
                </label>
                <input
                  id="monthly_benefit_amount"
                  required={!benefitsNotApproved}
                  tabIndex={benefitsNotApproved ? -1 : undefined}
                  placeholder="e.g. $943"
                  value={data.monthly_benefit_amount}
                  onChange={(e) => setField("monthly_benefit_amount", e.target.value)}
                />
              </div>
              {["SSI", "SSDI", "Social Security"].includes(data.benefit_type) && (
                <RadioGroup
                  name="medicare_medicaid"
                  label="Do you have Medicare or Medicaid?"
                  options={YES_NO}
                  value={data.medicare_medicaid}
                  onChange={(v) => setField("medicare_medicaid", v)}
                  required={!benefitsNotApproved}
                />
              )}
              <RadioGroup
                name="move_timeline"
                label="How soon are you looking to move into one of our homes?"
                options={MOVE_TIMELINE_OPTIONS}
                value={data.move_timeline}
                onChange={(v) => setField("move_timeline", v)}
                required={!benefitsNotApproved}
              />
              <div className="field">
                <label htmlFor="how_heard">How did you hear about us?</label>
                <select
                  id="how_heard"
                  required={!benefitsNotApproved}
                  tabIndex={benefitsNotApproved ? -1 : undefined}
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
                    required={!benefitsNotApproved}
                    tabIndex={benefitsNotApproved ? -1 : undefined}
                    placeholder="e.g. flyer, church, TikTok"
                    value={data.how_heard_other}
                    onChange={(e) => setField("how_heard_other", e.target.value)}
                  />
                </div>
              )}
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
                Are you applying for yourself only, or will others be living with you?
              </label>
              <select
                id="living_with_others"
                required
                value={data.living_with_others}
                onChange={(e) => {
                  const value = e.target.value;
                  setData((prev) => ({
                    ...prev,
                    living_with_others: value,
                    dependents_kind: value === APPLYING_WITH_DEPENDANTS ? prev.dependents_kind : "",
                    dependent_name: value === APPLYING_WITH_DEPENDANTS ? prev.dependent_name : "",
                    dependent_income:
                      value === APPLYING_WITH_DEPENDANTS ? prev.dependent_income : "",
                  }));
                }}
              >
                <option value="">Select one</option>
                {APPLYING_FOR_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {applyingWithDependants && (
              <>
                <p className="onboarding-aside">
                  This housing is best for serving adults with no underage dependents. If the
                  dependants are of legal age, they must be on a fixed income.
                </p>
                <RadioGroup
                  name="dependents_kind"
                  label="Are the dependants adults on a fixed income, or underage?"
                  options={DEPENDENT_KIND_OPTIONS}
                  value={data.dependents_kind}
                  onChange={(value) => {
                    setData((prev) => ({
                      ...prev,
                      dependents_kind: value,
                      dependent_name: value === DEPENDENTS_ADULTS ? prev.dependent_name : "",
                      dependent_income: value === DEPENDENTS_ADULTS ? prev.dependent_income : "",
                    }));
                  }}
                />
                {data.dependents_kind === DEPENDENTS_ADULTS && (
                  <>
                    <div className="field">
                      <label htmlFor="dependent_name">Dependent&apos;s name</label>
                      <input
                        id="dependent_name"
                        required
                        placeholder="If more than one, list each name"
                        value={data.dependent_name}
                        onChange={(e) => setField("dependent_name", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="dependent_income">
                        How much do they receive?
                      </label>
                      <input
                        id="dependent_income"
                        required
                        placeholder="e.g. $943 / month"
                        value={data.dependent_income}
                        onChange={(e) => setField("dependent_income", e.target.value)}
                      />
                    </div>
                  </>
                )}
                {dependantsNotAFit && (
                  <div
                    className="field onboarding-callout"
                    style={{ marginTop: 8, borderColor: "var(--gold)" }}
                  >
                    <p>Unfortunately we aren&apos;t the best fit for you.</p>
                  </div>
                )}
              </>
            )}
            {data.dependents_kind !== DEPENDENTS_UNDERAGE && (
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
            )}
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
              name="mental_diagnosis"
              label="Have you been diagnosed with a mental health condition?"
              options={YES_NO}
              value={data.mental_diagnosis}
              onChange={(v) => {
                setField("mental_diagnosis", v);
                if (v !== "Yes") {
                  setField("has_care_provider", "");
                  setField("care_provider_contact", "");
                  setField("care_provider_address", "");
                }
              }}
            />
            {data.mental_diagnosis === "Yes" && (
              <>
                <RadioGroup
                  name="has_care_provider"
                  label="Do you have a therapist or doctor?"
                  options={YES_NO}
                  value={data.has_care_provider}
                  onChange={(v) => {
                    setField("has_care_provider", v);
                    if (v !== "Yes") {
                      setField("care_provider_contact", "");
                      setField("care_provider_address", "");
                    }
                  }}
                />
                {data.has_care_provider === "Yes" && (
                  <>
                    <div className="field">
                      <label htmlFor="care_provider_contact">Therapist or doctor name and phone</label>
                      <input
                        id="care_provider_contact"
                        required
                        value={data.care_provider_contact}
                        onChange={(e) => setField("care_provider_contact", e.target.value)}
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
            <RadioGroup
              name="memory_loss"
              label="Have you ever been diagnosed with memory loss, dementia, Alzheimer’s disease, or another condition that affects your memory or ability to remember things?"
              options={YES_NO}
              value={data.memory_loss}
              onChange={(v) => setField("memory_loss", v)}
            />
          </>
        )}

        {step === 4 && (
          <>
            <YesNoExplain
              name="crime_conviction"
              label="Have you been convicted of a crime within the past 7 years?"
              value={data.crime_conviction}
              explainValue={data.crime_explanation}
              onChange={(v) => setField("crime_conviction", v)}
              onExplainChange={(v) => setField("crime_explanation", v)}
            />
            <YesNoExplain
              name="substance_abuse_history"
              label="Have you had a history of drug or alcohol abuse?"
              value={data.substance_abuse_history}
              explainValue={data.substance_abuse_explanation}
              onChange={(v) => setField("substance_abuse_history", v)}
              onExplainChange={(v) => setField("substance_abuse_explanation", v)}
            />
          </>
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
              during business hours. We use this information to review housing fit as described in
              our <Link href="/privacy">Privacy Policy</Link>.
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
          showNext={!((step === 1 && benefitsNotApproved) || (step === 2 && dependantsNotAFit))}
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
