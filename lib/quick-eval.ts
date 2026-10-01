import { APPLYING_FOR_OPTIONS } from "@/lib/residency-fields";

/** Same choice as the full application: housing for one person only. */
export const QUICK_EVAL_MYSELF = "Myself";

export type QuickEvalStep = {
  id: string;
  prompt: string;
  options: readonly string[];
  /** A matching answer counts toward the score. Gates are not scored. */
  fitAnswer?: string;
  /** This answer ends the check as not a fit. */
  denyAnswer?: string;
};

const YES_NO = ["Yes", "No"] as const;

const SCORED: QuickEvalStep[] = [
  {
    id: "benefit",
    prompt: "Do you receive SSI, SSDI, Social Security, or VA benefits?",
    options: YES_NO,
    fitAnswer: "Yes",
  },
  {
    id: "medications",
    prompt: "Do you manage your medications on your own?",
    options: YES_NO,
    fitAnswer: "Yes",
  },
  {
    id: "crime",
    prompt: "Have you been convicted of a crime in the past 7 years?",
    options: YES_NO,
    fitAnswer: "No",
  },
];

const HOUSING: QuickEvalStep = {
  id: "housing",
  prompt: "Are you applying for yourself only, or will others be living with you?",
  options: APPLYING_FOR_OPTIONS,
};

const OTHER_INCOME: QuickEvalStep = {
  id: "other_income",
  prompt: "Is that person receiving income?",
  options: YES_NO,
};

const LIVE_SEPARATE: QuickEvalStep = {
  id: "live_separate",
  prompt: "Are you willing to live separately?",
  options: YES_NO,
  denyAnswer: "No",
};

const DRUG_FREE: QuickEvalStep = {
  id: "drug_free",
  prompt: "Can you commit to no drugs?",
  options: YES_NO,
  denyAnswer: "No",
};

const HOME: QuickEvalStep = {
  id: "home",
  prompt: "Are you ready for a long-term home with your own bed in a shared house?",
  options: YES_NO,
  denyAnswer: "No",
};

/** Benefit, medications, and conviction. Two of these three still count as a fit. */
export const QUICK_EVAL_PASS_AT = 2;

export function quickEvalSteps(answers: Record<string, string>): QuickEvalStep[] {
  const withSomeone = Boolean(answers.housing) && answers.housing !== QUICK_EVAL_MYSELF;
  return [
    SCORED[0],
    HOUSING,
    ...(withSomeone ? [OTHER_INCOME, LIVE_SEPARATE] : []),
    SCORED[1],
    SCORED[2],
    DRUG_FREE,
    HOME,
  ];
}

export function quickEvalScore(answers: Record<string, string>): number {
  return SCORED.filter((question) => answers[question.id] === question.fitAnswer).length;
}

export function isQuickEvalDenied(answers: Record<string, string>): boolean {
  return quickEvalSteps(answers).some(
    (step) => Boolean(step.denyAnswer) && answers[step.id] === step.denyAnswer
  );
}

export function isQuickEvalFit(answers: Record<string, string>): boolean {
  if (isQuickEvalDenied(answers)) return false;
  const steps = quickEvalSteps(answers);
  if (steps.some((step) => !answers[step.id])) return false;
  return quickEvalScore(answers) >= QUICK_EVAL_PASS_AT;
}
