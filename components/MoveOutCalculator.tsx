"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { useCopy } from "@/components/SiteContentProvider";
import {
  calculateRoadmap,
  monthStart,
  MOTEL_MONTH,
  monthsLabel,
  ROADMAP_GOALS,
  roadmapMarks,
  type RoadmapGoal,
  type RoadmapMark,
} from "@/lib/move-out-calculator";
import { formatMoney, MONTHLY_RENT } from "@/lib/thrive-plan";

const STAYS = [
  { id: "motel", label: "Motel or hotel", amount: MOTEL_MONTH },
  { id: "alone", label: "Renting on my own", amount: 1200 },
  { id: "room", label: "Renting a room", amount: 750 },
  { id: "friend", label: "Staying with someone", amount: 0 },
] as const;

const BAR_CAP = 60;
const HORIZONS = [1, 2, 3, 4, 5] as const;
const GOAL_AMOUNTS: Record<RoadmapGoal, number> = {
  car: 8000,
  apartment: 1100,
  credit: 2000,
  savings: 5000,
};

function icsStamp(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function downloadCalendar(filename: string, planName: string, marks: RoadmapMark[]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//New Creation Living//Roadmap//EN",
    "CALSCALE:GREGORIAN",
    ...marks.flatMap((mark) => [
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${icsStamp(mark.date)}`,
      `SUMMARY:${planName}: ${mark.label.replace(/[,;\\]/g, " ")}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  const file = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function RoadmapCalendar({
  title,
  tone,
  years,
  marks,
  start,
  onExport,
}: {
  title: string;
  tone: "now" | "ncl";
  years: number;
  marks: RoadmapMark[];
  start: Date;
  onExport: () => void;
}) {
  const byMonth = new Map(marks.map((mark) => [mark.monthIndex, mark.label]));
  const groups: { year: number; months: { offset: number; date: Date; label?: string }[] }[] = [];
  for (let offset = 0; offset < years * 12; offset += 1) {
    const date = monthStart(start, offset);
    const year = date.getFullYear();
    const last = groups[groups.length - 1];
    const cell = { offset, date, label: byMonth.get(offset) };
    if (!last || last.year !== year) groups.push({ year, months: [cell] });
    else last.months.push(cell);
  }

  return (
    <article className={tone === "ncl" ? "calc-calendar is-ncl" : "calc-calendar"}>
      <div className="calc-calendar-head">
        <h3>{title}</h3>
        <button type="button" className="btn btn-ghost btn-sm" disabled={marks.length === 0} onClick={onExport}>
          Export calendar
        </button>
      </div>
      {groups.map((group) => (
        <div key={group.year} className="calc-year">
          <p>{group.year}</p>
          <div className="calc-months">
            {group.months.map((month) => (
              <div key={month.offset} className={month.label ? "calc-month is-mark" : "calc-month"}>
                <span>{month.date.toLocaleString("en-US", { month: "short" })}</span>
                {month.label ? <strong>{month.label}</strong> : null}
              </div>
            ))}
          </div>
        </div>
      ))}
      {marks.length === 0 ? <p className="calc-hint">No milestone lands in these years.</p> : null}
    </article>
  );
}

function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  return `tel:${digits}`;
}

function toNumber(value: string) {
  const next = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(next) ? next : 0;
}

function MoneyField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="field calc-field">
      <label htmlFor={id}>{label}</label>
      <div className="calc-money">
        <span aria-hidden="true">$</span>
        <input
          id={id}
          inputMode="numeric"
          value={value === 0 ? "" : value.toLocaleString("en-US")}
          placeholder="0"
          onChange={(event) => onChange(toNumber(event.target.value))}
        />
      </div>
      {hint ? <p className="calc-hint">{hint}</p> : null}
    </div>
  );
}

export default function MoveOutCalculator({ phone }: { phone: string }) {
  const copy = useCopy();
  const [income, setIncome] = useState(1400);
  const [stay, setStay] = useState<string>("motel");
  const [housingNow, setHousingNow] = useState(MOTEL_MONTH);
  const [billsNow, setBillsNow] = useState(150);
  const [savedNow, setSavedNow] = useState(0);
  const [saveShare, setSaveShare] = useState(0.5);
  const [goal, setGoal] = useState<RoadmapGoal>("apartment");
  const [amounts, setAmounts] = useState(GOAL_AMOUNTS);
  const [years, setYears] = useState<(typeof HORIZONS)[number]>(3);
  const planStart = useMemo(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1), []);

  const amount = amounts[goal];
  const goalCopy = ROADMAP_GOALS.find((item) => item.id === goal) ?? ROADMAP_GOALS[1];
  const result = useMemo(
    () => calculateRoadmap({ income, housingNow, billsNow, savedNow, saveShare, goal, amount }),
    [amount, billsNow, goal, housingNow, income, saveShare, savedNow]
  );
  const regularMarks = useMemo(
    () => roadmapMarks(result.now.months, years, goalCopy.ready, planStart),
    [goalCopy.ready, planStart, result.now.months, years]
  );
  const fastMarks = useMemo(
    () => roadmapMarks(result.ncl.months, years, goalCopy.ready, planStart),
    [goalCopy.ready, planStart, result.ncl.months, years]
  );

  const goalName =
    goal === "car"
      ? "a car"
      : goal === "credit"
        ? "that paydown"
        : goal === "savings"
          ? "that savings goal"
          : "your own apartment";
  const nclDone = Number.isFinite(result.ncl.months);
  const nowDone = Number.isFinite(result.now.months);
  const lowIncome = income < MONTHLY_RENT;

  const headline = !nclDone
    ? "Let's find a way to make it work."
    : !nowDone
      ? `At NCL, you could reach ${goalName} in ${monthsLabel(result.ncl.months)}.`
      : result.monthsSooner > 0
        ? `At NCL, you could reach ${goalName} ${monthsLabel(result.monthsSooner)} sooner.`
        : `You could reach ${goalName} in ${monthsLabel(result.ncl.months)}.`;

  const subline = !nclDone
    ? "Your income is under our monthly cost right now. Many people qualify for benefits that change this."
    : !nowDone
      ? "Right now, there is nothing left to save after housing and bills. At NCL, there is."
      : result.extraPerMonth > 0
        ? `That's ${formatMoney(result.extraPerMonth)} more saved every month, and ${formatMoney(result.savedFirstYear)} more in your first year.`
        : "Your plan works either way. NCL adds a safe, sober home and a team behind you.";

  function barWidth(months: number) {
    if (!Number.isFinite(months)) return 100;
    return Math.max(4, Math.min(100, (months / BAR_CAP) * 100));
  }

  return (
    <div className="onboarding-page">
      <header className="onboarding-header">
        <Link href="/" className="brand">
          <div className="brand-logo" aria-hidden="true">
            <BrandLogo clipId="calcClip" />
          </div>
          <div className="brand-text">
            <strong>New Creation Living</strong>
            <span>{copy("brand.tagline")}</span>
          </div>
        </Link>
        <Link href="/" className="onboarding-exit">
          Back to site
        </Link>
      </header>

      <main className="calc-main">
        <div className="calc-intro">
          <h1 className="onboarding-title calc-title">
            <span>What if your current income</span>
            <span>
              could take you <em>further?</em>
            </span>
          </h1>
          <p className="schedule-lead">
            Pick a goal for the next 1 to 5 years. The same income is shown two ways: a regular timeline, and an NCL
            fast-track. Living here is {formatMoney(MONTHLY_RENT)} a month, with everything included, so more of your
            income can go to the goal. We do not save your answers.
          </p>
        </div>

        <div className="calc-grid">
          <section className="onboarding-card calc-inputs" aria-label="Your numbers">
            <MoneyField
              id="calc-income"
              label="What you bring home each month"
              hint="Pay after taxes, plus any benefits like SSI, SSDI, or VA."
              value={income}
              onChange={setIncome}
            />
            <input
              type="range"
              className="calc-range"
              min={0}
              max={6000}
              step={50}
              value={Math.min(income, 6000)}
              onChange={(event) => setIncome(Number(event.target.value))}
              aria-label="Monthly income slider"
            />

            <div className="field calc-field">
              <span className="calc-label">Where are you staying now?</span>
              <div className="calc-chips" role="radiogroup" aria-label="Where are you staying now?">
                {STAYS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={stay === item.id}
                    className={stay === item.id ? "calc-chip is-on" : "calc-chip"}
                    onClick={() => {
                      setStay(item.id);
                      setHousingNow(item.amount);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <MoneyField
                id="calc-housing"
                label="Housing cost each month"
                hint={stay === "motel" ? `About $65 a night.` : undefined}
                value={housingNow}
                onChange={(value) => {
                  setHousingNow(value);
                  setStay("custom");
                }}
              />
              <MoneyField
                id="calc-bills"
                label="Utilities, Wi-Fi, laundry"
                hint="What you pay on top of housing."
                value={billsNow}
                onChange={setBillsNow}
              />
            </div>

            <div className="field calc-field">
              <span className="calc-label">What do you want in the next 1 to 5 years?</span>
              <div className="calc-chips" role="radiogroup" aria-label="What do you want in the next 1 to 5 years?">
                {ROADMAP_GOALS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={goal === item.id}
                    className={goal === item.id ? "calc-chip is-on" : "calc-chip"}
                    onClick={() => setGoal(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field calc-field">
              <span className="calc-label">How many years should the plan cover?</span>
              <div className="calc-chips" role="radiogroup" aria-label="How many years should the plan cover?">
                {HORIZONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="radio"
                    aria-checked={years === item}
                    className={years === item ? "calc-chip is-on" : "calc-chip"}
                    onClick={() => setYears(item)}
                  >
                    {item} {item === 1 ? "year" : "years"}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <MoneyField
                id="calc-goal-amount"
                label={goalCopy.amountLabel}
                hint={
                  goal === "apartment"
                    ? "First month, deposit, and $600 for fees and set-up."
                    : goal === "credit"
                      ? "Cards, collections, or past-due bills. This does not promise a credit score."
                      : undefined
                }
                value={amount}
                onChange={(value) => setAmounts((current) => ({ ...current, [goal]: value }))}
              />
              <MoneyField id="calc-saved" label="Saved so far" value={savedNow} onChange={setSavedNow} />
            </div>

            <div className="field calc-field">
              <label htmlFor="calc-share">
                Save {Math.round(saveShare * 100)}% of what&apos;s left each month
              </label>
              <input
                id="calc-share"
                type="range"
                className="calc-range"
                min={0.25}
                max={1}
                step={0.05}
                value={saveShare}
                onChange={(event) => setSaveShare(Number(event.target.value))}
              />
              <p className="calc-hint">The rest is for food, phone, travel, and life.</p>
            </div>
          </section>

          <section className="calc-results" aria-live="polite" aria-label="Your results">
            <div className="calc-hero">
              <h2>{headline}</h2>
              <p>{subline}</p>
              <div className="calc-target">
                <span>Your goal</span>
                <strong>{formatMoney(result.target)}</strong>
              </div>
              <ul className="calc-lines">
                {result.targetLines.map((line) => (
                  <li key={line.label}>
                    <span>{line.label}</span>
                    <span>{formatMoney(line.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="calc-compare">
              <div className="calc-side">
                <h3>Regular timeline</h3>
                <dl>
                  <div>
                    <dt>Housing and bills</dt>
                    <dd>{formatMoney(result.now.housing + billsNow)}</dd>
                  </div>
                  <div>
                    <dt>Left each month</dt>
                    <dd className={result.now.leftOver < 0 ? "is-negative" : undefined}>
                      {result.now.leftOver < 0 ? "-" : ""}
                      {formatMoney(Math.abs(result.now.leftOver))}
                    </dd>
                  </div>
                  <div>
                    <dt>Saved each month</dt>
                    <dd>{formatMoney(result.now.savePerMonth)}</dd>
                  </div>
                </dl>
                <div className="calc-time">
                  <span>Time to goal</span>
                  <strong>{monthsLabel(result.now.months)}</strong>
                </div>
                <div className="calc-bar" aria-hidden="true">
                  <div className="calc-bar-fill is-now" style={{ width: `${barWidth(result.now.months)}%` }} />
                </div>
              </div>

              <div className="calc-side is-ncl">
                <h3>NCL fast-track</h3>
                <dl>
                  <div>
                    <dt>Everything included</dt>
                    <dd>{formatMoney(MONTHLY_RENT)}</dd>
                  </div>
                  <div>
                    <dt>Left each month</dt>
                    <dd className={result.ncl.leftOver < 0 ? "is-negative" : undefined}>
                      {result.ncl.leftOver < 0 ? "-" : ""}
                      {formatMoney(Math.abs(result.ncl.leftOver))}
                    </dd>
                  </div>
                  <div>
                    <dt>Saved each month</dt>
                    <dd>{formatMoney(result.ncl.savePerMonth)}</dd>
                  </div>
                </dl>
                <div className="calc-time">
                  <span>Time to goal</span>
                  <strong>{monthsLabel(result.ncl.months)}</strong>
                </div>
                <div className="calc-bar" aria-hidden="true">
                  <div className="calc-bar-fill is-ncl" style={{ width: `${barWidth(result.ncl.months)}%` }} />
                </div>
              </div>
            </div>

            {lowIncome ? (
              <div className="onboarding-callout calc-callout">
                <p>
                  <strong>Income under {formatMoney(MONTHLY_RENT)}?</strong> You may qualify for SSI, SSDI, or VA
                  Pension. We screen for free.
                </p>
                <Link href="/benefits" className="btn btn-ghost">
                  Check my benefits
                </Link>
              </div>
            ) : null}

            <div className="calc-included">
              <strong>Included for {formatMoney(MONTHLY_RENT)} a month:</strong> furnished room, all utilities, Wi-Fi,
              laundry, and on-site management. No deposit stack. No surprise bills.
            </div>

            <div className="calc-cta">
              <Link href="/tour-eval" className="btn btn-primary">
                Request a tour
              </Link>
              <Link href="/apply" className="btn btn-primary">
                Apply today
              </Link>
              <Link href="/quickeval/check" className="btn btn-ghost">
                See if I&apos;m a fit
              </Link>
            </div>
            <p className="calc-hint calc-call">
              Questions? Call <a href={telHref(phone)}>{phone}</a>.
            </p>
            <p className="calc-fine">
              This is an estimate to help you plan. It is not a promise or financial advice. A better-credit plan is
              the paydown you entered, plus paying housing on time. It does not promise a credit score.
            </p>
          </section>

          <section className="calc-roadmap" aria-label="Your calendars">
            <div className="calc-calendars">
              <RoadmapCalendar
                title="Regular timeline"
                tone="now"
                years={years}
                marks={regularMarks}
                start={planStart}
                onExport={() => downloadCalendar("ncl-regular-timeline.ics", "Regular timeline", regularMarks)}
              />
              <RoadmapCalendar
                title="NCL fast-track"
                tone="ncl"
                years={years}
                marks={fastMarks}
                start={planStart}
                onExport={() => downloadCalendar("ncl-fast-track.ics", "NCL fast-track", fastMarks)}
              />
            </div>
            <p className="calc-offer">
              <Link href="/offer2">
                See our limited time offer below on how we will help you achieve your financial goals, increase
                stability while providing you a home!
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
