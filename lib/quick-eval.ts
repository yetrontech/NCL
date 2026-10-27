import {
  APPLYING_FOR_OPTIONS,
  APPLYING_WITH_DEPENDANTS,
  APPLYING_WITH_SPOUSE,
} from "@/lib/residency-fields";

/** Same choice as the full application: housing for one person only. */
export const QUICK_EVAL_MYSELF = "Myself";
export const QUICK_EVAL_PETS = "Myself and my pets";

export type QuickEvalStep = {
  id: string;
  prompt: string;
  options: readonly string[];
  /** A matching answer counts toward the score. Gates are not scored. */
  fitAnswer?: string;
  /** This answer ends the check as not a fit. */
  denyAnswer?: string;
  denyAnswers?: readonly string[];
};

const YES_NO = ["Yes", "No"] as const;

const SCORED: QuickEvalStep[] = [
  {
    id: "benefit",
    prompt: "Are you currently receiving any kind of income?",
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
  denyAnswers: [APPLYING_WITH_SPOUSE, QUICK_EVAL_PETS],
};

const UNDERAGE: QuickEvalStep = {
  id: "underage",
  prompt: "Are any of them under 18?",
  options: YES_NO,
  denyAnswer: "Yes",
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

export function stepDenies(step: QuickEvalStep, value: string): boolean {
  return value === step.denyAnswer || Boolean(step.denyAnswers?.includes(value));
}

export function quickEvalSteps(answers: Record<string, string>): QuickEvalStep[] {
  const housing = answers.housing;
  const dependants = housing === APPLYING_WITH_DEPENDANTS;
  const withAdults = dependants && answers.underage === "No";
  return [
    SCORED[0],
    HOUSING,
    ...(dependants ? [UNDERAGE] : []),
    ...(withAdults ? [OTHER_INCOME, LIVE_SEPARATE] : []),
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
  return quickEvalSteps(answers).some((step) => {
    const value = answers[step.id];
    return Boolean(value) && stepDenies(step, value);
  });
}

export function isQuickEvalFit(answers: Record<string, string>): boolean {
  if (isQuickEvalDenied(answers)) return false;
  const steps = quickEvalSteps(answers);
  if (steps.some((step) => !answers[step.id])) return false;
  return quickEvalScore(answers) >= QUICK_EVAL_PASS_AT;
}
