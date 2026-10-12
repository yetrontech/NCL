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

const HOME_SHORTS = [
  { id: "FWfWpfWgkCk", title: "NCL Testimony" },
  { id: "5TUgDS7Ifbg", title: "NCL Testimonial" },
  { id: "CbmGeEdV-os", title: "NCL Testimonial" },
  { id: "39BoOr4u92U", title: "New Creation Living Testimony" },
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
          <h1>
            Pay <span className="offer-hit">$199</span> starting next month.
          </h1>
          <p className="offer2-package">(Stability Speedrun Package)</p>
          <div className="offer2-video">
            <iframe
              src="https://www.youtube.com/embed/of_l6QMH0Ug"
              title="Pay $1 to move in. $199 going forward. New Creation Living"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p>
            Move in any day for <span className="offer-hit">$1</span>. Your rent doesn&apos;t start
            until the <span className="offer-hit">1st of next month</span>, then it&apos;s{" "}
            <span className="offer-hit">$798/month</span>. Regardless of move-in day. No tricks.
            Live here and decide from the inside if it&apos;s for you. If it&apos;s not for you,
            leave with our blessing.
          </p>
          <p>
            Bring a friend and you both get <span className="offer-hit">$100 off</span> next month.
            Bring 2 and choose your reward: pay just <span className="offer-hit">$199 rent</span>{" "}
            next month, or get a <span className="offer-hit">one-year paid gym membership</span>.
            Every referral after that earns you another <span className="offer-hit">$199 month</span>.
            No limit. Bring some friends and save almost <span className="offer-hit">$7,300</span>{" "}
            a year by doing nothing more!
          </p>
          <p>
            Your time is money. Talk to 10 people looking for housing, and if nobody is interested,
            we&apos;ll <span className="offer-hit">pay your hourly wage</span>.
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
          <p className="offer2-sale">
            Only you will know. <span>New location sale with limited space.</span>
          </p>
          <p className="guide-offer-eligible">See if you&apos;re eligible below!</p>
        </article>

        <article className="guide-card offer2-card offer2-educate">
          <p className="guide-kicker offer2-home-title">The Home</p>
          <div className="offer2-shorts">
            {HOME_SHORTS.map((short) => (
              <div className="offer2-short" key={short.id}>
                <iframe
                  src={`https://www.youtube.com/embed/${short.id}`}
                  title={short.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
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
