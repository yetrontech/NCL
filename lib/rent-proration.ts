const DAILY_RATE = 26.6;
const ADVERTISED_MONTHLY = 798;

export type MoveInProration = {
  dailyRate: number;
  daysRemaining: number;
  daysInMonth: number;
  monthLabel: string;
  moveInTotal: number;
  monthlyTotal: number;
};

/** $26.60 × days left in the month, including the move-in day. */
export function moveInProration(dateKey: string): MoveInProration {
  const [year, month, day] = dateKey.split("-").map(Number);
  const moveIn = new Date(year, (month || 1) - 1, day || 1);
  const daysInMonth = new Date(moveIn.getFullYear(), moveIn.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, daysInMonth - moveIn.getDate() + 1);
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    moveIn
  );

  return {
    dailyRate: DAILY_RATE,
    daysRemaining,
    daysInMonth,
    monthLabel,
    moveInTotal: Math.round(DAILY_RATE * daysRemaining * 100) / 100,
    monthlyTotal: ADVERTISED_MONTHLY,
  };
}

export function formatUsd(amount: number): string {
  const cents = Math.round(amount * 100) % 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents === 0 ? 0 : 2,
    maximumFractionDigits: cents === 0 ? 0 : 2,
  }).format(amount);
}
