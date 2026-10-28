"use client";

function endOfThisMonth(now = new Date()): string {
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return end.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export function OfferUntil({ placement }: { placement: "headline" | "sale" }) {
  const until = endOfThisMonth();
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
