"use client";

import { useState } from "react";
import Link from "next/link";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import { QUICK_EVAL_MYSELF, isQuickEvalFit, quickEvalSteps } from "@/lib/quick-eval";

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

  const steps = quickEvalSteps(answers);
  const found = steps.findIndex((step) => step.id === stepId);
  const index = found === -1 ? 0 : found;
  const question = steps[index];
  const fit = isQuickEvalFit(answers);

  function choose(value: string) {
    const next = { ...answers, [question.id]: value };
    if (question.id === "housing" && value === QUICK_EVAL_MYSELF) {
      delete next.other_income;
      delete next.live_separate;
    }
    setAnswers(next);

    if (question.denyAnswer && value === question.denyAnswer) {
      setDone(true);
      return;
    }

    const upcoming = quickEvalSteps(next);
    const at = upcoming.findIndex((step) => step.id === question.id);
    if (at === -1 || at >= upcoming.length - 1) {
      setDone(true);
      return;
    }
    setStepId(upcoming[at + 1].id);
  }

  function restart() {
    setAnswers({});
    setStepId("benefit");
    setDone(false);
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
      <p className="schedule-lead">Tap the answer that fits you. We do not save these answers.</p>
      <div className={stacked ? "quick-eval-choices is-list" : "quick-eval-choices"}>
        {question.options.map((option) => (
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
      {index > 0 && (
        <div className="onboarding-nav">
          <button type="button" className="btn btn-ghost" onClick={() => setStepId(steps[index - 1].id)}>
            Back
          </button>
        </div>
      )}
    </OnboardingShell>
  );
}
