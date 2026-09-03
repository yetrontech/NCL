export const BENEFIT_OPTIONS = [
  "SSI",
  "SSDI",
  "VA Benefits",
  "Social Security",
  "Not yet approved",
  "Other",
] as const;

export const GENDER_OPTIONS = ["Male", "Female"] as const;

export const YES_NO = ["Yes", "No"] as const;

export const MOVE_TIMELINE_OPTIONS = [
  "ASAP (0-48 HRS)",
  "7 Days",
  "30 days",
  "30+ days",
] as const;

export const PAYEE_OPTIONS = [
  "Yes, I understand and agree",
  "I have questions about this — please contact me before I continue",
] as const;

export const ROOMMATE_OPTIONS = ["I am ready", "I am not ready"] as const;

export const REFERRER_ROLES = [
  "Hospital discharge planner",
  "Social worker / case manager",
  "VA / veteran services staff",
  "Family member",
  "Other",
] as const;
