"use client";

import {
  DIAGNOSIS_HONESTY,
  DIAGNOSIS_OPTIONS,
  DIAGNOSIS_OTHER,
  parseListedDiagnoses,
  toggleListedDiagnosis,
} from "@/lib/listed-diagnoses";

export function DiagnosisChecklist({
  value,
  onChange,
  label = "Do you have any of these diagnoses? Select all that apply.",
  otherDetail,
  onOtherDetailChange,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  otherDetail?: string;
  onOtherDetailChange?: (value: string) => void;
}) {
  const selected = new Set(parseListedDiagnoses(value));
  const showOther = Boolean(onOtherDetailChange) && selected.has(DIAGNOSIS_OTHER);
  return (
    <div className="field">
      <label>{label}</label>
      <div className="field onboarding-callout" style={{ borderColor: "var(--gold)" }}>
        <p>{DIAGNOSIS_HONESTY}</p>
      </div>
      <div className="diagnosis-list">
        {DIAGNOSIS_OPTIONS.map((option) => (
          <div key={option}>
            <label className="diagnosis-option">
              <input
                type="checkbox"
                checked={selected.has(option)}
                onChange={() => onChange(toggleListedDiagnosis(value, option))}
              />
              <span>{option}</span>
            </label>
            {option === DIAGNOSIS_OTHER && showOther ? (
              <div className="field diagnosis-other">
                <label htmlFor="other-psychotic">Which other psychotic disorder?</label>
                <input
                  id="other-psychotic"
                  type="text"
                  value={otherDetail ?? ""}
                  maxLength={200}
                  onChange={(event) => onOtherDetailChange?.(event.target.value)}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
