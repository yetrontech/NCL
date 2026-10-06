"use client";

import { useEffect, useState } from "react";

const REFRESH_MS = 20_000;

export default function BedCount({ initial }: { initial: number | null }) {
  const [remaining, setRemaining] = useState<number | null>(initial);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const response = await fetch("/api/beds", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as { remaining?: unknown };
        if (cancelled || typeof body.remaining !== "number") return;
        setRemaining(body.remaining);
      } catch {
        // Keep the last count if a refresh fails.
      }
    }

    const timer = window.setInterval(refresh, REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (remaining === null) return null;

  const spot = remaining === 1 ? "spot" : "spots";

  return (
    <p className="guide-beds" aria-live="polite">
      <span className="guide-beds-dot" aria-hidden="true" />
      <strong>{remaining}</strong>
      <span className="guide-beds-phrase">
        available {spot} left in the whole city of Atlanta
      </span>
    </p>
  );
}
