import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import TourEvalScheduler from "@/components/onboarding/TourEvalScheduler";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { loadTourEvalSchedule } from "@/app/actions/tour-eval";
import { loadSiteContent } from "@/lib/site-content-server";

export const metadata: Metadata = {
  title: "Schedule your tour — New Creation Living",
  description: "Pick a time for your tour.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TourEvalSchedulePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [content, loaded] = await Promise.all([loadSiteContent(), loadTourEvalSchedule(token)]);
  const tagline = content["brand.tagline"] || "From Benefits to Belonging";

  return (
    <SiteContentProvider content={content}>
      <div className="onboarding-page">
        <header className="onboarding-header">
          <Link href="/" className="brand">
            <div className="brand-logo" aria-hidden="true">
              <BrandLogo clipId="tourEvalScheduleClip" />
            </div>
            <div className="brand-text">
              <strong>New Creation Living</strong>
              <span>{tagline}</span>
            </div>
          </Link>
        </header>
        <main className="onboarding-main">
          <div className="onboarding-card">
            <span className="eyebrow">Tour</span>
            <h1 className="onboarding-title">Schedule your tour</h1>
            {!loaded.ok ? (
              <p className="schedule-lead">{loaded.error}</p>
            ) : loaded.info.tourBooked ? (
              <p className="schedule-lead">Your tour is already scheduled. We will confirm by phone or email.</p>
            ) : (
              <TourEvalScheduler token={token} firstName={loaded.info.firstName} />
            )}
          </div>
        </main>
      </div>
    </SiteContentProvider>
  );
}
