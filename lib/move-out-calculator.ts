import { MONTHLY_RENT, money } from "@/lib/thrive-plan";

export type MoveGoal = "apartment" | "home";

export const MOTEL_NIGHT = 65;
export const MOTEL_MONTH = Math.round((MOTEL_NIGHT * 365) / 12);
export const APARTMENT_EXTRA_FEES = 600;
export const HOME_DOWN_RATE = 0.035;
export const HOME_CLOSING_RATE = 0.03;
export const NO_FINISH = Number.POSITIVE_INFINITY;

export type CalcInput = {
  income: number;
  housingNow: number;
  billsNow: number;
  savedNow: number;
  saveShare: number;
  goal: MoveGoal;
  apartmentRent: number;
  homePrice: number;
};

export type CalcSide = {
  housing: number;
  leftOver: number;
  savePerMonth: number;
  months: number;
};

export type CalcResult = {
  target: number;
  targetLines: { label: string; amount: number }[];
  now: CalcSide;
  ncl: CalcSide;
  extraPerMonth: number;
  monthsSooner: number;
  savedFirstYear: number;
};

export function goalTarget(input: Pick<CalcInput, "goal" | "apartmentRent" | "homePrice">) {
  if (input.goal === "home") {
    const down = money(input.homePrice * HOME_DOWN_RATE);
    const closing = money(input.homePrice * HOME_CLOSING_RATE);
    return {
      target: down + closing,
      lines: [
        { label: "Down payment (3.5%)", amount: down },
        { label: "Closing costs (about 3%)", amount: closing },
      ],
    };
  }
  const rent = money(input.apartmentRent);
  return {
    target: rent * 2 + APARTMENT_EXTRA_FEES,
    lines: [
      { label: "First month's rent", amount: rent },
      { label: "Security deposit", amount: rent },
      { label: "Fees, utilities set-up, and basics", amount: APARTMENT_EXTRA_FEES },
    ],
  };
}

function side(income: number, housing: number, bills: number, share: number, need: number): CalcSide {
  const leftOver = money(income) - money(housing) - money(bills);
  const savePerMonth = leftOver > 0 ? money(leftOver * share) : 0;
  const months = need <= 0 ? 0 : savePerMonth > 0 ? Math.ceil(need / savePerMonth) : NO_FINISH;
  return { housing: money(housing), leftOver, savePerMonth, months };
}

export function calculate(input: CalcInput): CalcResult {
  const { target, lines } = goalTarget(input);
  const share = Math.min(1, Math.max(0.1, input.saveShare));
  const need = Math.max(0, target - money(input.savedNow));
  const now = side(input.income, input.housingNow, input.billsNow, share, need);
  const ncl = side(input.income, MONTHLY_RENT, 0, share, need);
  const monthsSooner =
    Number.isFinite(now.months) && Number.isFinite(ncl.months) ? Math.max(0, now.months - ncl.months) : 0;
  return {
    target,
    targetLines: lines,
    now,
    ncl,
    extraPerMonth: Math.max(0, ncl.savePerMonth - now.savePerMonth),
    monthsSooner,
    savedFirstYear: Math.max(0, (ncl.savePerMonth - now.savePerMonth) * 12),
  };
}

export function monthsLabel(months: number) {
  if (!Number.isFinite(months)) return "Not yet";
  if (months === 0) return "Now";
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const yearText = `${years} ${years === 1 ? "year" : "years"}`;
  return rest === 0 ? yearText : `${yearText}, ${rest} ${rest === 1 ? "month" : "months"}`;
}
