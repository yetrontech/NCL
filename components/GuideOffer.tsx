"use client";

import { useState } from "react";
import Link from "next/link";
import BedCount from "@/components/BedCount";

export default function GuideOffer({ bedsRemaining }: { bedsRemaining: number | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="guide-card guide-offer">
      <BedCount initial={bedsRemaining} />
      <div className="guide-offer-banner">Limited Space Offer</div>
      <h2>We&apos;ll pay for your transportation to our home.</h2>
      <p className="guide-offer-terms">Pay 1 month.</p>
      <p className="guide-offer-highlight">We guarantee you safety, stability, and a home.</p>
      <p>
        If you decide this is not the place for you, we&apos;ll give you a 100% refund within 7
        days of move-in.
      </p>
      <p>
        Once you become a resident, on your second successful referral, your full month&apos;s
        rent will be only $125 for the whole month.
      </p>
      <p>Each additional successful referral gives you another month of $125 in rent.</p>

      {open ? (
        <div className="guide-offer-more">
          <h3>A few months from now</h3>
          <p>Your friends, family, and peers may wonder:</p>
          <ul className="guide-offer-quotes">
            <li>How did you find this home?</li>
            <li>How did you get so far ahead?</li>
            <li>What changed?</li>
          </ul>
          <p>Only you will know.</p>
        </div>
      ) : null}

      <button
        type="button"
        className="guide-offer-more-btn"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Show less" : "Read more"}
      </button>

      <p className="guide-offer-eligible">See if you are eligible below</p>
      <Link href="/quickeval/check" className="guide-offer-cta">
        See if you&apos;re a good fit
      </Link>
    </div>
  );
}
