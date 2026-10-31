import { listedDiagnosisError } from "@/lib/listed-diagnoses";
import { APPLYING_FOR_OPTIONS } from "@/lib/residency-fields";

/** Same choices as the full application. Pets can continue. A spouse or dependants cannot. */
export const QUICK_EVAL_MYSELF = "Myself";
export const QUICK_EVAL_PETS = "Myself and my pets";

export function isAllowedHousehold(value: string): boolean {
  return value === QUICK_EVAL_MYSELF || value === QUICK_EVAL_PETS;
}

export type QuickEvalStep = {
  id: string;
  prompt: string;
  note?: string;
  options: readonly string[];
  /** A matching answer counts toward the score. Gates are not scored. */
  fitAnswer?: string;
  /** This answer ends the check as not a fit. */
  denyAnswer?: string;
  denyAnswers?: readonly string[];
  /** Checkbox step. The answer is a JSON list and does not deny anyone. */
  multi?: boolean;
  /** Render the choices as radio buttons. This answer is not scored. */
  radios?: boolean;
};

export const TOUR_REWARDS = [
  "$20 MARTA card",
  "Gas card",
  "Tire inflator, car charger, and phone mount",
] as const;

export function isTourReward(value: string): boolean {
  return (TOUR_REWARDS as readonly string[]).includes(value);
}

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

const MALE: QuickEvalStep = {
  id: "male",
  prompt: "Are you male?",
  note: "We are accepting only male applicants.",
  options: YES_NO,
  denyAnswer: "No",
};

const HOUSING: QuickEvalStep = {
  id: "housing",
  prompt: "Are you applying for yourself only, or will others be living with you?",
  options: APPLYING_FOR_OPTIONS,
  denyAnswers: APPLYING_FOR_OPTIONS.filter((option) => !isAllowedHousehold(option)),
};

const DIAGNOSES: QuickEvalStep = {
  id: "diagnoses",
  prompt: "Do you have any of these diagnoses?",
  options: [],
  multi: true,
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

const REWARD: QuickEvalStep = {
  id: "reward",
  prompt: "Which reward do you want?",
  note: "You choose one when you finish. This does not change whether you are a fit.",
  options: TOUR_REWARDS,
  radios: true,
};

/** Benefit, medications, and conviction. Two of these three still count as a fit. */
export const QUICK_EVAL_PASS_AT = 2;

export function stepDenies(step: QuickEvalStep, value: string): boolean {
  return value === step.denyAnswer || Boolean(step.denyAnswers?.includes(value));
}

export function quickEvalSteps(_answers: Record<string, string>): QuickEvalStep[] {
  return [SCORED[0], MALE, HOUSING, SCORED[1], DIAGNOSES, SCORED[2], DRUG_FREE, HOME, REWARD];
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
  if (steps.some((step) => step.multi && listedDiagnosisError(answers[step.id] || "[]"))) return false;
  return quickEvalScore(answers) >= QUICK_EVAL_PASS_AT;
}
