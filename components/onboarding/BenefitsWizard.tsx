"use client";

import { useState, type FormEvent } from "react";
import { submitBenefitsScreening } from "@/app/actions/forms";
import { trackGoogleAdsContactConversion } from "@/lib/google-ads";
import { YES_NO } from "@/lib/residency-fields";
import OnboardingShell from "./OnboardingShell";
import { NavButtons, RadioGroup } from "./FieldHelpers";

type Status = "idle" | "submitting" | "success" | "error";

const BENEFIT_OPTIONS = ["SSI", "SSDI", "VA Pension", "Social Security", "Not Sure"] as const;
const APPLIED_OPTIONS = [
  "No, never",
  "Yes, and was denied",
  "Yes, application is pending",
] as const;

const STEPS = ["About you", "Benefit type", "Work & military", "Income & situation"] as const;

const initial = {
  "ben-first": "",
  "ben-last": "",
  "ben-phone": "",
  "ben-email": "",
  "ben-type": "",
  "ben-applied": "",
  "ben-military": "",
  "ben-disability": "",
  "ben-ss-history": "",
  "ben-last-worked": "",
  "ben-income-assets": "",
  "ben-notes": "",
};

export default function BenefitsWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function setField<K extends keyof typeof initial>(key: K, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep(): string | null {
    if (step === 0) {
      if (!data["ben-first"] || !data["ben-last"] || !data["ben-phone"] || !data["ben-email"]) {
        return "Please complete all fields on this step.";
      }
    }
    if (step === 1) {
      if (!data["ben-type"] || !data["ben-applied"]) {
        return "Please complete all fields on this step.";
      }
    }
    if (step === 2) {
      if (
        !data["ben-military"] ||
        !data["ben-disability"] ||
        !data["ben-ss-history"] ||
        !data["ben-last-worked"]
      ) {
        return "Please complete all fields on this step.";
      }
    }
    if (step === 3) {
      if (!data["ben-income-assets"]) {
        return "Please enter your income and assets information.";
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

    const result = await submitBenefitsScreening(formData);
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
      <OnboardingShell
        title="Screening received"
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
          <p>We will be in touch within 72 hours. For anything urgent, call (404) 731-2371.</p>
          <a href="/#page-benefits" className="btn btn-primary" style={{ marginTop: 20 }}>
            Back to site
          </a>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell
      title={STEPS[step]}
      subtitle="Benefits screening"
      step={step}
      totalSteps={STEPS.length}
    >
      <form onSubmit={handleContinue}>
        {step === 0 && (
          <>
            <div className="field-row">
              <div className="field">
                <label htmlFor="ben-first">First name</label>
                <input
                  id="ben-first"
                  required
                  value={data["ben-first"]}
                  onChange={(e) => setField("ben-first", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="ben-last">Last name</label>
                <input
                  id="ben-last"
                  required
                  value={data["ben-last"]}
                  onChange={(e) => setField("ben-last", e.target.value)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="ben-phone">Phone number</label>
                <input
                  id="ben-phone"
                  type="tel"
                  required
                  value={data["ben-phone"]}
                  onChange={(e) => setField("ben-phone", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="ben-email">Email address</label>
                <input
                  id="ben-email"
                  type="text"
                  required
                  value={data["ben-email"]}
                  onChange={(e) => setField("ben-email", e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <RadioGroup
              name="ben-type"
              label="Which benefit are you seeking help with?"
              options={BENEFIT_OPTIONS}
              value={data["ben-type"]}
              onChange={(v) => setField("ben-type", v)}
            />
            <RadioGroup
              name="ben-applied"
              label="Have you ever applied for this benefit in the past?"
              options={APPLIED_OPTIONS}
              value={data["ben-applied"]}
              onChange={(v) => setField("ben-applied", v)}
            />
          </>
        )}

        {step === 2 && (
          <>
            <RadioGroup
              name="ben-military"
              label="Have you ever served in the U.S. military?"
              options={YES_NO}
              value={data["ben-military"]}
              onChange={(v) => setField("ben-military", v)}
            />
            <RadioGroup
              name="ben-disability"
              label="Do you have a disability or medical condition that prevents you from working, and has it lasted (or is it expected to last) at least 12 months?"
              options={YES_NO}
              value={data["ben-disability"]}
              onChange={(v) => setField("ben-disability", v)}
            />
            <div className="field">
              <label htmlFor="ben-ss-history">
                How long have you worked and paid into Social Security?
              </label>
              <input
                id="ben-ss-history"
                required
                value={data["ben-ss-history"]}
                onChange={(e) => setField("ben-ss-history", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="ben-last-worked">When was the last time you worked?</label>
              <input
                id="ben-last-worked"
                required
                value={data["ben-last-worked"]}
                onChange={(e) => setField("ben-last-worked", e.target.value)}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="field">
              <label htmlFor="ben-income-assets">
                What is your total monthly income and the rough value of your assets (savings,
                property, etc.)?
              </label>
              <textarea
                id="ben-income-assets"
                rows={4}
                required
                value={data["ben-income-assets"]}
                onChange={(e) => setField("ben-income-assets", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="ben-notes">
                Briefly describe your situation or health conditions (optional)
              </label>
              <textarea
                id="ben-notes"
                rows={4}
                placeholder="This helps us evaluate your path to approval..."
                value={data["ben-notes"]}
                onChange={(e) => setField("ben-notes", e.target.value)}
              />
            </div>
            <p className="form-note">
              Free screening. No obligation. Confidential submission. We typically follow up within
              72 hours.
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
          nextLabel={step === STEPS.length - 1 ? "Submit Screening Request" : "Continue"}
          submitting={status === "submitting"}
        />
      </form>
    </OnboardingShell>
  );
}
