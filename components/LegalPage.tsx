import type { ReactNode } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function LegalPage({
  title,
  tagline,
  updated,
  children,
}: {
  title: string;
  tagline: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="legal-page">
      <header className="onboarding-header">
        <Link href="/" className="brand">
          <div className="brand-logo" aria-hidden="true">
            <BrandLogo clipId="legalClip" />
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

      <main className="legal-main">
        <article className="legal-doc">
          <span className="eyebrow">Legal</span>
          <h1>{title}</h1>
          <p className="legal-updated">Effective {updated}</p>
          {children}
        </article>
      </main>
    </div>
  );
}
