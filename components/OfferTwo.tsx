import Link from "next/link";
import BedCount from "@/components/BedCount";
import BrandLogo from "@/components/BrandLogo";

const PROGRAMS = [
  {
    title: "New Creation Rewards™",
    body: "A growth-based rewards system that recognizes your progress and independence with free rent credits, MARTA passes, Mastercard gift cards, and more.",
  },
  {
    title: "New Creation Thrive™",
    body: "A resident growth program that helps people improve their finances, pursue employment, develop career skills, and build toward greater independence.",
  },
  {
    title: "New Creation Benefits™",
    body: "Get help navigating SNAP (food stamps), SSDI, VA Disability or Pension, and other programs you may qualify for.",
  },
  {
    title: "The New Creation Guide™",
    body: "Connections, opportunities, and resources to help you move forward.",
  },
] as const;

const HOME_ITEMS = [
  "Furnished Home",
  "Kitchen",
  "Utilities",
  "Laundry",
  "MARTA Access",
  "Sober & Drug-Free Environment",
  "And More",
];

export default function OfferTwo({ bedsRemaining }: { bedsRemaining: number | null }) {
  return (
    <div className="guide-page offer2-page">
      <div className="offer2-wrap">
        <Link href="/" className="guide-logo" aria-label="New Creation Living">
          <BrandLogo clipId="offer2Clip" />
        </Link>

        <article className="guide-card offer2-card">
          <BedCount initial={bedsRemaining} />
          <p className="offer2-value">Free Move-In Month, $125 Next ($1,400 value!)</p>
          <h1>Stability Speedrun Package</h1>
          <p>
            You need stability. You need security. You worry about having money left over after
            paying rent. We understand. That&apos;s why we have our Stability Speedrun Package.
          </p>
          <p>
            Move in absolutely free. Walk away absolutely free. No tricks or games. We&apos;re
            running this no-risk offer to prove this is the home for you. We don&apos;t want a yes
            or no today. We just ask you to make an informed decision, and the only way to do that
            is from the inside, not the outside.
          </p>
          <p>
            If you decide this place is not for you, you may leave with our blessings. If you
            leave, you can&apos;t come back.
          </p>
          <p>
            But wait… there&apos;s more! We&apos;d rather fill the house with friends who already
            trust each other than with strangers. Successfully help one friend, and you both get
            $100 off next month. Help 2 friends successfully move in (they also get the free
            move-in month offer, with $100 off their next month) and you&apos;ll only pay $199 in
            rent next month! One bill with everything included. (Save almost $1,400 in your first
            2 months!)
          </p>
          <p>
            But that&apos;s not all! Each additional successful referral gives you another month of
            $199 rent (your friends will get the free move-in month offer, with $100 off their
            next month). No limit. Help 13 friends find a home and save almost $7,300 in one year
            by doing nothing! We know your time is money, so give it a try. Talk to 10 people
            looking for housing, and if nobody is interested, we&apos;ll pay your hourly wage for
            your time and effort.
          </p>
          <p className="offer2-more">And guess what? There&apos;s more! You&apos;ll receive access to:</p>

          <div className="offer2-programs">
            {PROGRAMS.map((program) => (
              <section key={program.title}>
                <h2>{program.title}</h2>
                <p>{program.body}</p>
              </section>
            ))}
          </div>

          <h2>Everything You Need in a Home</h2>
          <ul className="offer2-chips">
            {HOME_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>A Few Months From Now…</h2>
          <p>Your friends, family, and peers may wonder:</p>
          <ul className="guide-offer-quotes">
            <li>How did you find this home?</li>
            <li>How did you get so far ahead?</li>
            <li>What changed?</li>
          </ul>
          <p>Only you will know.</p>
          <p className="guide-offer-eligible">See if you&apos;re eligible below</p>
        </article>

        <article className="guide-card offer2-card offer2-educate">
          <p className="guide-kicker">The home</p>
          <p>
            New Creation Living provides modern, all-inclusive homes built for stability, security,
            and growth. For just $26/day ($798/month), enjoy a renovated, furnished home with beds,
            TVs, free laundry, utilities, Wi-Fi, MARTA access, community support, and a sober,
            drug-free environment. Our on-site managers help turn a house into a home!
          </p>
          <p>
            We don&apos;t just provide housing; we provide a launchpad for your future. Through
            programs like NCL Thrive, NCL Benefits, and NCL Guide, you gain access to resources,
            financial growth opportunities, and new connections. You can also earn free rent
            credits, Mastercard gift cards, MARTA cards, and more!
          </p>
          <p>
            Our shared homes offer added privacy and comfort with personalized room access,
            floor-to-ceiling privacy screens, lockable nightstands, common-area cameras, and
            on-site management focused on safety and growth.
          </p>
          <p>
            Located in great areas near public transportation and major stores, our modern homes
            offer more than a place to live—they offer a place to grow!
          </p>
        </article>

        <article className="guide-card offer2-card offer2-eligible" id="eligibility">
          <p className="guide-kicker">Eligibility</p>
          <h2>See if you&apos;re eligible</h2>
          <Link href="/quickeval/check" className="guide-offer-cta">
            See if you&apos;re a good fit
          </Link>
        </article>

        <p className="guide-footer">
          New Creation Living · Atlanta, GA · newcreationliving.org · (404) 731-2371
        </p>
      </div>
    </div>
  );
}
