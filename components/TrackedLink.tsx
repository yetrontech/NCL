"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type SiteClickKey = "calculate_offer" | "offer_fit";

export function TrackedLink({
  href,
  click,
  className,
  children,
}: {
  href: string;
  click: SiteClickKey;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => recordSiteClick(click)}>
      {children}
    </Link>
  );
}

function recordSiteClick(key: SiteClickKey) {
  const body = JSON.stringify({ key });
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const sent = navigator.sendBeacon("/api/clicks", new Blob([body], { type: "application/json" }));
      if (sent) return;
    }
  } catch {
    // Fall through to fetch so a blocked beacon still tries once.
  }
  void fetch("/api/clicks", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
