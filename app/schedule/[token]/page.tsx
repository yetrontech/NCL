import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import ScheduleMoveInRequest from "@/components/ScheduleMoveInRequest";
import { loadScheduleLink, SCHEDULE_PHONE } from "@/lib/schedule-link";

export const metadata: Metadata = {
  title: "Schedule your move-in — New Creation Living",
  description: "Choose a move-in date within 35 days. Staff will confirm and email you.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const info = await loadScheduleLink(token);

  return (
    <div className="onboarding-page schedule-page">
      <header className="onboarding-header">
        <Link href="/" className="brand">
          <div className="brand-logo" aria-hidden="true">
            <BrandLogo clipId="scheduleClip" />
          </div>
          <div className="brand-text">
            <strong>New Creation Living</strong>
            <span>From Benefits to Belonging</span>
          </div>
        </Link>
        <Link href="/" className="onboarding-exit">
          Back to site
        </Link>
      </header>
      <main className="onboarding-main">
        <div className="onboarding-card">
          <span className="eyebrow">Move-in</span>
          <h1 className="onboarding-title">Schedule your move-in</h1>
          {info.open ? (
            <ScheduleMoveInRequest
              token={token}
              firstName={info.firstName}
              windowEnd={info.windowEnd}
              requestedMoveInAt={info.requestedMoveInAt}
              busy={info.busy}
            />
          ) : (
            <div className="onboarding-callout">
              <p>
                This link is no longer open. Call{" "}
                <a href="tel:+14047312371">{SCHEDULE_PHONE}</a>.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
