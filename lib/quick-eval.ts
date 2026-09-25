/** Short housing-fit check. A "fit" answer matches what the full application treats as a yes. */
export const QUICK_EVAL_QUESTIONS = [
  {
    id: "benefit",
    prompt: "Do you receive SSI, SSDI, Social Security, or VA benefits?",
    fitAnswer: "Yes",
  },
  {
    id: "minors",
    prompt: "Would anyone under 18 live with you?",
    fitAnswer: "No",
  },
  {
    id: "medications",
    prompt: "Do you manage your medications on your own?",
    fitAnswer: "Yes",
  },
  {
    id: "crime",
    prompt: "Have you been convicted of a crime in the past 7 years?",
    fitAnswer: "No",
  },
  {
    id: "drug_free",
    prompt: "Can you commit to a drug- and alcohol-free home?",
    fitAnswer: "Yes",
  },
  {
    id: "home",
    prompt: "Are you ready for a long-term home with your own bed in a shared house?",
    fitAnswer: "Yes",
  },
] as const;

/** 4 of 6. A five-question version of this check would pass at 3 of 5. */
export const QUICK_EVAL_PASS_AT = 4;

export function quickEvalScore(answers: Record<string, string>): number {
  return QUICK_EVAL_QUESTIONS.filter((question) => answers[question.id] === question.fitAnswer)
    .length;
}

export function isQuickEvalFit(answers: Record<string, string>): boolean {
  return quickEvalScore(answers) >= QUICK_EVAL_PASS_AT;
}
