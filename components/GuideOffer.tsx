"use client";

import { useState } from "react";
import Link from "next/link";

const INCLUDED = [
  "Free rent and gift card rewards",
  "NA/AA meeting resource guide",
  "Work, volunteer, and school resources",
  "Financial growth course",
  "AI education",
  "Transportation to the home",
];

export default function GuideOffer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="guide-card guide-offer">
      <div className="guide-offer-banner">Limited-time offer</div>
      <h2>Pay 1 month, move in within 48 hours</h2>
      <p className="guide-offer-terms">No security deposit · No credit check · No extra fees</p>
      <p>We&apos;ll provide transportation to your new home, and you can move in within 48 hours.</p>
      <p>
        You have 7 days to decide. If it&apos;s not right, we refund 100% of your first month&apos;s
        payment, minus transportation fees.
      </p>

      {open ? (
        <div className="guide-offer-more">
          <h3>You&apos;ll also get</h3>
          <ul>
            {INCLUDED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Everything you need in a home</h3>
          <p>
            Furnished home, kitchen, utilities, laundry, Wi-Fi, MARTA access, house manager,
            security, community activities, a sober and drug-free environment, and more.
          </p>

          <h3>Your referrals can lower your rent</h3>
          <p>Refer someone who moves in.</p>
          <p className="guide-offer-highlight">
            On your second referral: pay only $125 for a full month&apos;s rent.
          </p>
          <p>And every additional referral means you pay only $125 for that month&apos;s rent.</p>

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

      <Link href="/quickeval/check" className="guide-offer-cta">
        See if you&apos;re a good fit
      </Link>
    </div>
  );
}
