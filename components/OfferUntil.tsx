"use client";

function ordinal(day: number): string {
  const teen = day % 100;
  if (teen >= 11 && teen <= 13) return `${day}th`;
  if (day % 10 === 1) return `${day}st`;
  if (day % 10 === 2) return `${day}nd`;
  if (day % 10 === 3) return `${day}rd`;
  return `${day}th`;
}

function endOfNextMonth(now = new Date()): string {
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  const month = end.toLocaleDateString("en-US", { month: "long" });
  return `${month} ${ordinal(end.getDate())}`;
}

export function OfferUntil({ placement }: { placement: "headline" | "sale" }) {
  const until = endOfNextMonth();
  if (placement === "headline") {
    return (
      <p className="offer2-package">
        This offer is only until the end of the month. Only until {until}.
      </p>
    );
  }
  return (
    <p className="offer2-sale">
      Only you will know.{" "}
      <span>New location sale with limited space. Only until {until}.</span>
    </p>
  );
}
