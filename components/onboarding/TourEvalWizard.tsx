"use client";

import { useState } from "react";
import { DiagnosisChecklist } from "@/components/onboarding/DiagnosisChecklist";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import { submitTourEval, type TourEvalContact } from "@/app/actions/tour-eval";
import { listedDiagnosisError } from "@/lib/listed-diagnoses";
import {
  QUICK_EVAL_MYSELF,
  QUICK_EVAL_PETS,
  quickEvalSteps,
  stepDenies,
} from "@/lib/quick-eval";
import { APPLYING_WITH_DEPENDANTS, APPLYING_WITH_SPOUSE } from "@/lib/residency-fields";

const EMPTY_CONTACT: TourEvalContact = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
};

function contactError(contact: TourEvalContact) {
  if (!contact.firstName.trim() || !contact.lastName.trim()) return "Enter your first and last name.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email.trim())) return "Enter a valid email.";
  if (contact.phone.replace(/\D/g, "").length < 10) return "Enter a phone number.";
  if (contact.gender !== "Male" && contact.gender !== "Female") return "Select a gender.";
  return "";
}

export default function TourEvalWizard({ phone }: { phone: string }) {
  const [contact, setContact] = useState<TourEvalContact>(EMPTY_CONTACT);
  const [onContact, setOnContact] = useState(true);
  const [stepId, setStepId] = useState("benefit");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [diagnosisError, setDiagnosisError] = useState("");

  const steps = quickEvalSteps(answers);
  const found = steps.findIndex((step) => step.id === stepId);
  const index = found === -1 ? 0 : found;
  const question = steps[index];
  const totalSteps = 1 + Math.max(steps.length, 1);

  async function finish(next: Record<string, string>) {
    setBusy(true);
    setError("");
    const result = await submitTourEval(contact, next);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setAnswers(next);
    setDone(true);
  }

  function choose(value: string) {
    const next = { ...answers, [question.id]: value };
    if (question.id === "housing") {
      if (value !== APPLYING_WITH_DEPENDANTS) delete next.underage;
      if (value === QUICK_EVAL_MYSELF || value === APPLYING_WITH_SPOUSE || value === QUICK_EVAL_PETS) {
        delete next.other_income;
        delete next.live_separate;
      }
    }
    setAnswers(next);
    if (stepDenies(question, value)) {
      void finish(next);
      return;
    }
    const upcoming = quickEvalSteps(next);
    const at = upcoming.findIndex((step) => step.id === question.id);
    if (at === -1 || at >= upcoming.length - 1) {
      void finish(next);
      return;
    }
    setStepId(upcoming[at + 1].id);
  }

  function continueDiagnoses() {
    const message = listedDiagnosisError(answers.diagnoses || "[]");
    if (message) {
      setDiagnosisError(message);
      return;
    }
    setDiagnosisError("");
    const upcoming = quickEvalSteps(answers);
    const at = upcoming.findIndex((step) => step.id === "diagnoses");
    if (at === -1 || at >= upcoming.length - 1) {
      void finish(answers);
      return;
    }
    setStepId(upcoming[at + 1].id);
  }

  if (done) {
    return (
      <OnboardingShell title="We have your answers" subtitle="Tour evaluation" step={totalSteps - 1} totalSteps={totalSteps}>
        <p className="schedule-lead">
          Thank you. Our team will review this. If we can offer a tour, we will email you a link to pick a time.
        </p>
        <p className="schedule-lead">
          Questions? Call <a href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a>.
        </p>
      </OnboardingShell>
    );
  }

  if (onContact) {
    return (
      <OnboardingShell title="Tell us how to reach you" subtitle="Tour evaluation" step={0} totalSteps={totalSteps}>
        <p className="schedule-lead">
          This is the same check we use to see if a tour makes sense. We keep the answers so our team can approve or
          deny a tour.
        </p>
        <div className="field-row">
          <div className="field">
            <label htmlFor="eval-first">First name</label>
            <input
              id="eval-first"
              value={contact.firstName}
              onChange={(event) => setContact({ ...contact, firstName: event.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="eval-last">Last name</label>
            <input
              id="eval-last"
              value={contact.lastName}
              onChange={(event) => setContact({ ...contact, lastName: event.target.value })}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="eval-phone">Phone</label>
            <input
              id="eval-phone"
              type="tel"
              value={contact.phone}
              onChange={(event) => setContact({ ...contact, phone: event.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="eval-email">Email</label>
            <input
              id="eval-email"
              type="email"
              value={contact.email}
              onChange={(event) => setContact({ ...contact, email: event.target.value })}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="eval-gender">Gender</label>
          <select
            id="eval-gender"
            value={contact.gender}
            onChange={(event) => setContact({ ...contact, gender: event.target.value })}
          >
            <option value="">Select one</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        {error ? (
          <div className="field onboarding-callout" style={{ borderColor: "var(--gold)" }}>
            <p>{error}</p>
          </div>
        ) : null}
        <div className="onboarding-nav">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const message = contactError(contact);
              if (message) {
                setError(message);
                return;
              }
              setError("");
              setOnContact(false);
            }}
          >
            Continue
          </button>
        </div>
      </OnboardingShell>
    );
  }

  const stacked = question.options.length > 2;

  return (
    <OnboardingShell
      title={question.prompt}
      subtitle="Tour evaluation"
      step={1 + index}
      totalSteps={totalSteps}
    >
      {error ? (
        <div className="field onboarding-callout" style={{ borderColor: "var(--gold)" }}>
          <p>{error}</p>
        </div>
      ) : null}
      {question.multi ? (
        <>
          <p className="schedule-lead">Select every one that applies. This does not decide the tour by itself.</p>
          <DiagnosisChecklist
            value={answers.diagnoses || "[]"}
            onChange={(value) => {
              setDiagnosisError("");
              setAnswers({ ...answers, diagnoses: value });
            }}
          />
          {diagnosisError ? (
            <div className="field onboarding-callout" style={{ borderColor: "var(--gold)" }}>
              <p>{diagnosisError}</p>
            </div>
          ) : null}
          <div className="onboarding-nav">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => (index === 0 ? setOnContact(true) : setStepId(steps[index - 1].id))}
            >
              Back
            </button>
            <button type="button" className="btn btn-primary" disabled={busy} onClick={continueDiagnoses}>
              {busy ? "Sending…" : "Continue"}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="schedule-lead">Tap the answer that fits you.</p>
          <div className={stacked ? "quick-eval-choices is-list" : "quick-eval-choices"}>
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                className="quick-eval-choice"
                disabled={busy}
                onClick={() => choose(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="onboarding-nav">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => (index === 0 ? setOnContact(true) : setStepId(steps[index - 1].id))}
            >
              Back
            </button>
          </div>
        </>
      )}
    </OnboardingShell>
  );
}
