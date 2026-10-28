"use client";

import {
  DIAGNOSIS_HONESTY,
  DIAGNOSIS_OPTIONS,
  parseListedDiagnoses,
  toggleListedDiagnosis,
} from "@/lib/listed-diagnoses";

export function DiagnosisChecklist({
  value,
  onChange,
  label = "Do you have any of these diagnoses? Select all that apply.",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const selected = new Set(parseListedDiagnoses(value));
  return (
    <div className="field">
      <label>{label}</label>
      <div className="field onboarding-callout" style={{ borderColor: "var(--gold)" }}>
        <p>{DIAGNOSIS_HONESTY}</p>
      </div>
      <div className="diagnosis-list">
        {DIAGNOSIS_OPTIONS.map((option) => (
          <label className="diagnosis-option" key={option}>
            <input
              type="checkbox"
              checked={selected.has(option)}
              onChange={() => onChange(toggleListedDiagnosis(value, option))}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
