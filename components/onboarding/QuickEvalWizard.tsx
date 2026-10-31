"use client";

import { useState } from "react";
import Link from "next/link";
import { DiagnosisChecklist } from "@/components/onboarding/DiagnosisChecklist";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import { listedDiagnosisError } from "@/lib/listed-diagnoses";
import { isQuickEvalFit, quickEvalSteps, stepDenies } from "@/lib/quick-eval";

function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  return `tel:${digits}`;
}

export default function QuickEvalWizard({ phone }: { phone: string }) {
  const [stepId, setStepId] = useState("benefit");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState("");
  const [picked, setPicked] = useState("");

  const steps = quickEvalSteps(answers);
  const found = steps.findIndex((step) => step.id === stepId);
  const index = found === -1 ? 0 : found;
  const question = steps[index];
  const fit = isQuickEvalFit(answers);

  function choose(value: string) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);

    if (stepDenies(question, value)) {
      setDone(true);
      return;
    }

    const upcoming = quickEvalSteps(next);
    const at = upcoming.findIndex((step) => step.id === question.id);
    if (at === -1 || at >= upcoming.length - 1) {
      setDone(true);
      return;
    }
    const following = upcoming[at + 1].id;
    setStepId(following);
    setPicked(next[following] || "");
  }

  function goBack(id: string) {
    setStepId(id);
    setPicked(answers[id] || "");
  }

  function continueDiagnoses() {
    const error = listedDiagnosisError(answers.diagnoses || "[]");
    if (error) {
      setDiagnosisError(error);
      return;
    }
    setDiagnosisError("");
    const upcoming = quickEvalSteps(answers);
    const at = upcoming.findIndex((step) => step.id === "diagnoses");
    if (at === -1 || at >= upcoming.length - 1) {
      setDone(true);
      return;
    }
    const following = upcoming[at + 1].id;
    setStepId(following);
    setPicked(answers[following] || "");
  }

  function restart() {
    setAnswers({});
    setStepId("benefit");
    setPicked("");
    setDone(false);
    setDiagnosisError("");
  }

  if (done) {
    return (
      <OnboardingShell
        title={fit ? "You look like a great fit" : "Quick check"}
        subtitle="Quick check"
        step={Math.max(steps.length - 1, 0)}
        totalSteps={steps.length}
      >
        {fit ? (
          <>
            <p className="schedule-lead">
              Wonderful news. From what you shared, New Creation Living could be a real home for
              you. This quick check is not the final word — your application is how our team gets
              to know you. We would love to see you apply.
            </p>
            <p className="schedule-lead">
              When you fill out the form, use promo code <strong>NCL26</strong>.
            </p>
            <div className="onboarding-nav">
              <button type="button" className="btn btn-ghost" onClick={restart}>
                Start over
              </button>
              <Link href="/apply?promo=NCL26" className="btn btn-primary">
                Apply today
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="schedule-lead">
              Unfortunately, you may not be a good fit. Please contact{" "}
              <a href={telHref(phone)}>{phone}</a> for more questions.
            </p>
            <div className="onboarding-nav">
              <button type="button" className="btn btn-ghost" onClick={restart}>
                Start over
              </button>
              <Link href="/" className="btn btn-primary">
                Back to the site
              </Link>
            </div>
          </>
        )}
      </OnboardingShell>
    );
  }

  const stacked = question.options.length > 2;

  return (
    <OnboardingShell
      title={question.prompt}
      subtitle="Quick check"
      step={index}
      totalSteps={steps.length}
    >
      {question.multi ? (
        <>
          <p className="schedule-lead">
            Select every one that applies. This does not decide eligibility. We do not save these
            answers.
          </p>
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
            {index > 0 ? (
              <button type="button" className="btn btn-ghost" onClick={() => goBack(steps[index - 1].id)}>
                Back
              </button>
            ) : null}
            <button type="button" className="btn btn-primary" onClick={continueDiagnoses}>
              Continue
            </button>
          </div>
        </>
      ) : (
        <>
      <p className="schedule-lead">Select an answer, then tap Next. We do not save these answers.</p>
      {index === 0 ? <p className="male-only-note">We are accepting only male applicants.</p> : null}
      {question.note ? <p className="quick-eval-note">{question.note}</p> : null}
      <div className={stacked ? "quick-eval-choices is-list" : "quick-eval-choices"}>
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            className={option === picked ? "quick-eval-choice is-selected" : "quick-eval-choice"}
            aria-pressed={option === picked}
            onClick={() => setPicked(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="onboarding-nav">
        {index > 0 ? (
          <button type="button" className="btn btn-ghost" onClick={() => goBack(steps[index - 1].id)}>
            Back
          </button>
        ) : null}
        <button type="button" className="btn btn-primary" disabled={!picked} onClick={() => choose(picked)}>
          Next
        </button>
      </div>
        </>
      )}
    </OnboardingShell>
  );
}
