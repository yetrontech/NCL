export const MONTHLY_RENT = 798;
export const REFERRAL_ONE_SAVINGS = 100;
export const REFERRAL_TWO_RENT = 199;
export const MIN_MONTHS = 2;
export const MAX_MONTHS = 120;
export const MAX_REFERRALS = 20;

export type ThriveKind = 'credit' | 'home' | 'car' | 'emergency_fund' | 'debt' | 'purchase';
export type PlanKind = 'saving' | 'expedited';
export type FastMode = 'lower' | 'sooner';
export type TaskRepeat = 'once' | 'weekly' | 'every_2_weeks' | 'monthly';
export type WeekMark = 'hit' | 'missed' | 'caught_up';
export type TrackStatus = 'on_track' | 'behind' | 'no_plan';

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export type PlanQuote = {
  weekly: number;
  weeks: number;
  credit: number;
  remaining: number;
};

export type FastTrackQuote = {
  credit: number;
  remaining: number;
  lower: PlanQuote;
  sooner: PlanQuote;
};

export function money(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

export function formatMoney(value: number) {
  return `$${money(value).toLocaleString('en-US')}`;
}

export function perMonth(weekly: number) {
  return money((weekly * 52) / 12);
}

/** Each pair of referrals is one month of rent at $199. One extra referral adds $100. */
export function referralSavings(referrals: number, rent = MONTHLY_RENT) {
  const count = Math.max(0, Math.floor(referrals));
  const pairs = Math.floor(count / 2);
  const single = count % 2;
  return pairs * Math.max(0, rent - REFERRAL_TWO_RENT) + single * REFERRAL_ONE_SAVINGS;
}

export function referralLabel(count: number, rent = MONTHLY_RENT) {
  if (count === 1) return 'Refer 1 · save $100';
  if (count === 2) return `Refer 2 · rent is $${REFERRAL_TWO_RENT}`;
  return `Refer ${count} · save ${formatMoney(referralSavings(count, rent))}`;
}

export function ymd(value: Date) {
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${value.getFullYear()}-${month}-${day}`;
}

export function parseDay(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function addDays(value: Date, days: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

export function weekStartSunday(day = new Date()) {
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  start.setDate(start.getDate() - start.getDay());
  return ymd(start);
}

export function weeksBetween(startOn: string, targetOn: string) {
  const days = Math.round((parseDay(targetOn).getTime() - parseDay(startOn).getTime()) / 86400000);
  return Math.max(1, Math.ceil(Math.max(days, 1) / 7));
}

export function clampMonths(months: number) {
  return Math.min(MAX_MONTHS, Math.max(MIN_MONTHS, Math.round(Number(months) || MIN_MONTHS)));
}

export function addMonths(startOn: string, months: number) {
  const start = parseDay(startOn);
  const next = new Date(start.getFullYear(), start.getMonth() + Math.round(months), 1);
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(start.getDate(), lastDay));
  return ymd(next);
}

export function monthsBetween(startOn: string, targetOn: string) {
  const start = parseDay(startOn);
  const end = parseDay(targetOn);
  return Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth());
}

export function durationLabel(months: number) {
  if (months < 12 || months % 12 !== 0) return `${months} ${months === 1 ? 'month' : 'months'}`;
  const years = months / 12;
  return `${years} ${years === 1 ? 'year' : 'years'}`;
}

export function weeksLabel(weeks: number) {
  if (weeks < 9) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  return durationLabel(Math.max(1, Math.round((weeks * 7) / 30.44)));
}

export function savingPlan(target: number, weeks: number): PlanQuote {
  const safeWeeks = Math.max(1, Math.round(weeks));
  const amount = money(target);
  return {
    weekly: money(amount / safeWeeks),
    weeks: safeWeeks,
    credit: 0,
    remaining: amount,
  };
}

export function fastTrackPlans(target: number, referrals: number, weeks: number, rent = MONTHLY_RENT): FastTrackQuote {
  const credit = referralSavings(referrals, rent);
  const remaining = Math.max(0, money(target) - credit);
  const baseWeekly = Math.max(1, savingPlan(target, weeks).weekly);
  const lower = { ...savingPlan(remaining, weeks), credit, remaining };
  const soonerWeeks = remaining === 0 ? 1 : Math.max(1, Math.ceil(remaining / baseWeekly));
  const sooner = { weekly: remaining === 0 ? 0 : baseWeekly, weeks: soonerWeeks, credit, remaining };
  return { credit, remaining, lower, sooner };
}

export function fastTrackQuote(target: number, referrals: number, weeks: number, mode: FastMode, rent = MONTHLY_RENT) {
  const plans = fastTrackPlans(target, referrals, weeks, rent);
  return mode === 'sooner' ? plans.sooner : plans.lower;
}

export function finishOn(startOn: string, weeks: number) {
  return ymd(addDays(parseDay(startOn), Math.max(1, weeks) * 7));
}

type WeekRow = { status: WeekMark | null; actual: number | null; planned: number };

export function savedSoFar(weeks: WeekRow[]) {
  return weeks.reduce(
    (sum, week) => (week.status === 'hit' || week.status === 'caught_up' ? sum + (week.actual ?? week.planned) : sum),
    0
  );
}

export type Replan = {
  referrals: number;
  credit: number;
  extraCredit: number;
  weekly: number;
  targetOn: string;
  weeksSooner: number;
};

/** What the plan looks like from today if the resident has `referrals` in total. */
export function replanWithReferrals(
  goal: { targetAmount: number; targetOn: string; weeklyAmount: number; referralsPlanned: number; planKind: PlanKind; weeks: WeekRow[] },
  referrals: number,
  mode: FastMode,
  rent = MONTHLY_RENT,
  today = new Date()
): Replan {
  const todayKey = ymd(today);
  const currentCredit = goal.planKind === 'expedited' ? referralSavings(goal.referralsPlanned, rent) : 0;
  const credit = referralSavings(referrals, rent);
  const left = Math.max(0, money(goal.targetAmount) - credit - savedSoFar(goal.weeks));
  const weeksLeft = goal.targetOn > todayKey ? weeksBetween(todayKey, goal.targetOn) : 1;
  if (mode === 'lower') {
    return {
      referrals,
      credit,
      extraCredit: credit - currentCredit,
      weekly: money(left / weeksLeft),
      targetOn: goal.targetOn,
      weeksSooner: 0,
    };
  }
  const weekly = Math.max(1, goal.weeklyAmount);
  const needWeeks = left === 0 ? 1 : Math.max(1, Math.ceil(left / weekly));
  const nextEnd = finishOn(todayKey, Math.min(needWeeks, weeksLeft));
  return {
    referrals,
    credit,
    extraCredit: credit - currentCredit,
    weekly: left === 0 ? 0 : weekly,
    targetOn: nextEnd,
    weeksSooner: Math.max(0, weeksLeft - needWeeks),
  };
}

export function onTrack(weeks: { weekStart: string; status: WeekMark | null }[], today = new Date()) {
  const current = weekStartSunday(today);
  return !weeks.some((week) => week.status === 'missed' && week.weekStart < current);
}

export function nextReferralLine(current: number) {
  return (current + 1) % 2 === 0
    ? `1 more friend and one month of rent is $${REFERRAL_TWO_RENT}.`
    : `1 more friend and $${REFERRAL_ONE_SAVINGS} goes toward this.`;
}

export function bundleTrack(
  goals: { status: string; weeks: { weekStart: string; status: WeekMark | null }[] }[]
): TrackStatus {
  const active = goals.filter((goal) => goal.status === 'active');
  if (active.length === 0) return 'no_plan';
  return active.every((goal) => onTrack(goal.weeks)) ? 'on_track' : 'behind';
}
