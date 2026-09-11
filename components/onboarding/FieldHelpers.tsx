"use client";

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  required = true,
}: {
  name: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="radio-group">
        {options.map((option, index) => (
          <label className="radio-pill" key={option}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              required={required && index === 0 && !value}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

export function YesNoExplain({
  name,
  label,
  value,
  explainValue,
  onChange,
  onExplainChange,
  explainLabel = "If yes, please explain",
}: {
  name: string;
  label: string;
  value: string;
  explainValue: string;
  onChange: (value: string) => void;
  onExplainChange: (value: string) => void;
  explainLabel?: string;
}) {
  return (
    <>
      <RadioGroup
        name={name}
        label={label}
        options={["Yes", "No"]}
        value={value}
        onChange={(next) => {
          onChange(next);
          if (next === "No") onExplainChange("");
        }}
      />
      {value === "Yes" && (
        <div className="field">
          <label htmlFor={`${name}-explain`}>{explainLabel}</label>
          <textarea
            id={`${name}-explain`}
            name={`${name}_explanation`}
            rows={3}
            required
            value={explainValue}
            onChange={(e) => onExplainChange(e.target.value)}
          />
        </div>
      )}
    </>
  );
}

export function NavButtons({
  onBack,
  nextLabel = "Continue",
  showBack = true,
  showNext = true,
  submitting = false,
}: {
  onBack?: () => void;
  nextLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  submitting?: boolean;
}) {
  if (!showBack && !showNext) return null;

  return (
    <div className="onboarding-nav">
      {showBack ? (
        <button type="button" className="btn btn-ghost" onClick={onBack} disabled={submitting}>
          Back
        </button>
      ) : (
        <span />
      )}
      {showNext ? (
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Submitting..." : nextLabel}
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
