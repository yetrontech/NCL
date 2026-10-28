/** Condition-column labels. The word "severe" appears only where that list already uses it. */
export const LISTED_DIAGNOSES = [
  "Schizoaffective disorder",
  "Major depressive disorder (severe)",
  "Post-traumatic stress disorder (PTSD), severe",
  "Borderline personality disorder (BPD)",
  "Obsessive-compulsive disorder (OCD), severe",
  "Delusional disorder",
  "Severe panic disorder or agoraphobia",
  "Eating disorders, such as severe anorexia nervosa",
  "Severe substance use disorders",
  "Other psychotic disorders",
] as const;

export const DIAGNOSIS_NONE = "None of these";

export const DIAGNOSIS_OPTIONS = [...LISTED_DIAGNOSES, DIAGNOSIS_NONE] as const;

export const DIAGNOSIS_HONESTY =
  "Having one or more of these diagnoses does not mean you are not eligible. If you are lying, you will be kicked out and banned, whether you were accepted or denied.";

const ALLOWED = new Set<string>(DIAGNOSIS_OPTIONS);

export function parseListedDiagnoses(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && ALLOWED.has(item));
  } catch {
    return [];
  }
}

export function toggleListedDiagnosis(current: string, label: string): string {
  if (!ALLOWED.has(label)) return current;
  const selected = new Set(parseListedDiagnoses(current));
  if (label === DIAGNOSIS_NONE) {
    return JSON.stringify(selected.has(DIAGNOSIS_NONE) ? [] : [DIAGNOSIS_NONE]);
  }
  selected.delete(DIAGNOSIS_NONE);
  if (selected.has(label)) selected.delete(label);
  else selected.add(label);
  return JSON.stringify(LISTED_DIAGNOSES.filter((item) => selected.has(item)));
}

export function listedDiagnosisError(value: string): string | null {
  if (parseListedDiagnoses(value).length === 0) {
    return "Please select any diagnoses that apply, or None of these.";
  }
  return null;
}

export function listedDiagnosesFromRaw(raw: string): string[] {
  const picked = parseListedDiagnoses(raw);
  if (picked.includes(DIAGNOSIS_NONE)) return [DIAGNOSIS_NONE];
  return LISTED_DIAGNOSES.filter((item) => picked.includes(item));
}
