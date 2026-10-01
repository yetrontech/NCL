"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { sendFreeGuides } from "@/app/actions/guides";
import BedCount from "@/components/BedCount";
import { FREE_GUIDES, FREE_GUIDES_ZIP, freeGuideHref } from "@/lib/free-guides";

export default function GuideSignup({ bedsRemaining }: { bedsRemaining: number | null }) {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const result = await sendFreeGuides(new FormData(event.currentTarget));
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
  }

  return (
    <div className="guide-page">
      <div>
        <div className="guide-card">
          <BedCount initial={bedsRemaining} />
          <Link href="/" className="guide-logo" aria-label="New Creation Living">
            <BrandLogo clipId="guideClip" />
          </Link>
          <div className="guide-kicker">Free guides</div>
          <h1>Here&apos;s what to know on a fixed income</h1>
          <p className="guide-sub">
            A daily plan, an honest housing comparison, and what a fixed income actually covers
            in metro Atlanta. Enter your email and we&apos;ll send all three.
          </p>

          {sent ? (
            <div className="guide-success">
              <p className="guide-sub">You&apos;re set — tap below to download them now.</p>
              <div className="guide-downloads">
                <a
                  className="guide-download-all"
                  download={FREE_GUIDES_ZIP.filename}
                  href={freeGuideHref(FREE_GUIDES_ZIP.filename)}
                >
                  {FREE_GUIDES_ZIP.button}
                </a>
                {FREE_GUIDES.map((guide) => (
                  <a key={guide.filename} download={guide.filename} href={freeGuideHref(guide.filename)}>
                    {guide.button}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                autoComplete="email"
                required
                disabled={pending}
              />
              <button type="submit" disabled={pending}>
                {pending ? "Sending…" : "Send me the guides"}
              </button>
              {error ? <p className="guide-error">{error}</p> : null}
            </form>
          )}

          <p className="guide-fineprint">
            No spam. Just these guides, and occasionally something else useful.{" "}
            <Link href="/privacy">Privacy</Link>
          </p>
        </div>
        <p className="guide-footer">
          New Creation Living · Atlanta, GA · newcreationliving.org · (404) 731-2371
        </p>
      </div>
    </div>
  );
}
