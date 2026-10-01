const NO_DIAGNOSIS = new Set([
  "none",
  "n/a",
  "na",
  "n.a.",
  "no",
  "no diagnosis",
  "none reported",
]);

/** Blank, none, or N/A means there is no diagnosis to act on. */
export function hasWrittenDiagnosis(value: string | null | undefined): boolean {
  const text = (value || "").trim().toLowerCase().replace(/\.$/, "");
  if (!text) return false;
  return !NO_DIAGNOSIS.has(text);
}

/** Stored yes/no used by scoring and the move-in safety copy. */
export function mentalLimitationsFromAnswer(value: string | null | undefined): "Yes" | "No" {
  return hasWrittenDiagnosis(value) ? "Yes" : "No";
}

const SERIOUS_DIAGNOSIS = /\b(bipolar|schizophrenia|schizoaffective|psychosis|psychotic)\b/i;

/** Owner and administrator reminder for serious psychiatric diagnoses. */
export function needsCareReminder(diagnosis: string | null | undefined): boolean {
  return SERIOUS_DIAGNOSIS.test(diagnosis || "");
}
