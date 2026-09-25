import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import BrandLogo from "@/components/BrandLogo";
import { loadSiteContent } from "@/lib/site-content-server";

const SITE_URL = "https://www.newcreationliving.org";
const CHECK_PATH = "/quickeval/check";
const CHECK_URL = `${SITE_URL}${CHECK_PATH}`;

export const metadata: Metadata = {
  title: "Quick check — New Creation Living",
  description:
    "Scan the code or start a six-question check to see whether New Creation Living may be a fit.",
  alternates: { canonical: "/quickeval" },
};

export const revalidate = 30;

export default async function QuickEvalPage() {
  const content = await loadSiteContent();
  const tagline = content["brand.tagline"] || "From Benefits to Belonging";
  const svg = await QRCode.toString(CHECK_URL, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#1B2B5E", light: "#FFFFFF" },
  });

  return (
    <div className="onboarding-page">
      <header className="onboarding-header">
        <Link href="/" className="brand">
          <div className="brand-logo" aria-hidden="true">
            <BrandLogo clipId="quickEvalClip" />
          </div>
          <div className="brand-text">
            <strong>New Creation Living</strong>
            <span>{tagline}</span>
          </div>
        </Link>
        <Link href="/" className="onboarding-exit">
          Back to site
        </Link>
      </header>

      <main className="onboarding-main">
        <div className="onboarding-card quick-eval-card">
          <span className="eyebrow">Quick check</span>
          <h1 className="onboarding-title">See if this home may be a fit</h1>
          <p className="schedule-lead">
            Scan the code, or use the button under it. Both open the same six-question check. It
            takes about a minute. We do not save the answers.
          </p>
          <a href={CHECK_PATH} className="quick-eval-qr" aria-label="Start the quick check">
            <span dangerouslySetInnerHTML={{ __html: svg }} />
          </a>
          <Link href={CHECK_PATH} className="btn btn-primary quick-eval-start">
            Start the quick check
          </Link>
        </div>
      </main>
    </div>
  );
}
