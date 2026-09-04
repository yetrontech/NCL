/** Ideal responses that indicate a highly favorable applicant/referee. */
const IDEAL_RESPONSES = {
  mobility_limitations: "No",
  mental_limitations: "No",
  medications_independent: "Yes",
  medical_prescriptions: "No",
  crime_conviction: "No",
  substance_abuse_history: "No",
  drug_free_commitment: "Yes",
  value_understanding: "Yes",
  home_not_short_term: "Yes",
  payee_agreement: "Yes, I understand and agree",
  roommate_commitment: "I am ready",
  aggression_history: "No",
  elopement_risk: "No",
  communal_living_interference: "No",
} as const;

const APPLICATION_CRITERIA = [
  "mobility_limitations",
  "mental_limitations",
  "medications_independent",
  "medical_prescriptions",
  "crime_conviction",
  "substance_abuse_history",
  "drug_free_commitment",
  "value_understanding",
  "home_not_short_term",
  "payee_agreement",
  "roommate_commitment",
] as const satisfies ReadonlyArray<keyof typeof IDEAL_RESPONSES>;

const REFERRAL_EXTRA_CRITERIA = [
  "aggression_history",
  "elopement_risk",
  "communal_living_interference",
] as const satisfies ReadonlyArray<keyof typeof IDEAL_RESPONSES>;

export type ResidencyScoreFields = Partial<
  Record<keyof typeof IDEAL_RESPONSES, string | null | undefined>
>;

export type FavorabilityScore = {
  score: number;
  max_score: number;
  percent: number;
  label: "Highly favorable" | "Favorable" | "Mixed" | "Needs review";
  display: string;
};

function answeredCriteria(
  input: ResidencyScoreFields,
  criteria: readonly (keyof typeof IDEAL_RESPONSES)[]
) {
  return criteria.filter((key) => (input[key] || "").trim() !== "");
}

function scoreCriteria(
  input: ResidencyScoreFields,
  criteria: readonly (keyof typeof IDEAL_RESPONSES)[]
): number {
  return criteria.reduce((total, key) => {
    const value = (input[key] || "").trim();
    return value === IDEAL_RESPONSES[key] ? total + 1 : total;
  }, 0);
}

function buildLabel(percent: number): FavorabilityScore["label"] {
  if (percent >= 90) return "Highly favorable";
  if (percent >= 70) return "Favorable";
  if (percent >= 50) return "Mixed";
  return "Needs review";
}

function buildScore(
  input: ResidencyScoreFields,
  criteria: readonly (keyof typeof IDEAL_RESPONSES)[]
): FavorabilityScore {
  const present = answeredCriteria(input, criteria);
  const max_score = present.length;
  const score = scoreCriteria(input, present);
  const percent = max_score === 0 ? 0 : Math.round((score / max_score) * 100);

  return {
    score,
    max_score,
    percent,
    label: buildLabel(percent),
    display: `${score}/${max_score} (${percent}%)`,
  };
}

export function scoreApplication(input: ResidencyScoreFields): FavorabilityScore {
  return buildScore(input, APPLICATION_CRITERIA);
}

export function scoreReferral(input: ResidencyScoreFields): FavorabilityScore {
  return buildScore(input, [...APPLICATION_CRITERIA, ...REFERRAL_EXTRA_CRITERIA]);
}
