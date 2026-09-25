"use client";

import { useState } from "react";
import Link from "next/link";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import { QUICK_EVAL_QUESTIONS, isQuickEvalFit } from "@/lib/quick-eval";

const TOTAL = QUICK_EVAL_QUESTIONS.length;

function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  return `tel:${digits}`;
}

export default function QuickEvalWizard({ phone }: { phone: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const question = QUICK_EVAL_QUESTIONS[step];
  const fit = isQuickEvalFit(answers);

  function choose(value: string) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (step === TOTAL - 1) {
      setDone(true);
      return;
    }
    setStep(step + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  if (done) {
    return (
      <OnboardingShell
        title={fit ? "You may be a good fit" : "Quick check"}
        subtitle="Quick check"
        step={TOTAL - 1}
        totalSteps={TOTAL}
      >
        {fit ? (
          <>
            <p className="schedule-lead">
              You may be a good fit. This is a quick check, not an application decision. The full
              application is how our team reviews housing.
            </p>
            <div className="onboarding-nav">
              <button type="button" className="btn btn-ghost" onClick={restart}>
                Start over
              </button>
              <Link href="/apply" className="btn btn-primary">
                Start the application
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

  return (
    <OnboardingShell
      title={question.prompt}
      subtitle="Quick check"
      step={step}
      totalSteps={TOTAL}
    >
      <p className="schedule-lead">Tap the answer that fits you. We do not save these answers.</p>
      <div className="quick-eval-choices">
        {["Yes", "No"].map((option) => (
          <button
            key={option}
            type="button"
            className="quick-eval-choice"
            onClick={() => choose(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {step > 0 && (
        <div className="onboarding-nav">
          <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
            Back
          </button>
        </div>
      )}
    </OnboardingShell>
  );
}
