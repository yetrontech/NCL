import Link from "next/link";
import BedCount from "@/components/BedCount";
import BrandLogo from "@/components/BrandLogo";
import OfferCorners from "@/components/OfferCorners";

const PROGRAMS = [
  {
    title: "NCL Rewards",
    body: "Earn free rent credits, gift cards, MARTA passes, and even paid hotel nights for your progress.",
  },
  {
    title: "NCL Thrive",
    body: "We help you find work and build the skills that raise your income.",
  },
  {
    title: "NCL Benefits",
    body: "Free help getting on SNAP, SSDI, and VA benefits, so you save more and keep more of every month.",
  },
  {
    title: "NCL Guide",
    body: "The connections and resources to help you move forward.",
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
    <div className="guide-page offer2-page has-corners">
      <OfferCorners />
      <div className="offer2-wrap">
        <Link href="/" className="guide-logo" aria-label="New Creation Living">
          <BrandLogo clipId="offer2Clip" />
        </Link>

        <article className="guide-card offer2-card">
          <BedCount initial={bedsRemaining} />
          <h1>Move In Today for Just $1. Pay Starting Next Month.</h1>
          <p className="offer2-package">(Stability Speedrun Package)</p>
          <p>
            Move in any day for $1. Your rent doesn&apos;t start until the 1st of next month, then
            it&apos;s $798/month. Regardless of move-in day. No tricks. Live here and decide from
            the inside if it&apos;s for you. If it&apos;s not for you, leave with our blessing.
          </p>
          <p>
            Bring a friend and you both get $100 off next month. Bring 2 and choose your reward:
            pay just $199 rent next month, or get a one-year paid gym membership. Every referral
            after that earns you another $199 month. No limit. Bring some friends and save almost
            $7,300 a year by doing nothing more!
          </p>
          <p>
            Your time is money. Talk to 10 people looking for housing, and if nobody is interested,
            we&apos;ll pay your hourly wage.
          </p>
          <p className="offer2-more">Plus, we help you earn more and keep more.</p>

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

          <h2>A FEW MONTHS FROM NOW...</h2>
          <p>Your friends, family, and peers may wonder:</p>
          <ul className="guide-offer-quotes">
            <li>How did you find this home?</li>
            <li>How did you get so far ahead?</li>
            <li>What changed?</li>
          </ul>
          <p>Only you will know. New location sale with limited space.</p>
          <p className="guide-offer-eligible">See if you&apos;re eligible below!</p>
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
