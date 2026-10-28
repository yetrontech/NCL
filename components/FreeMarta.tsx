import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import MartaArrow from "@/components/MartaArrow";
import OfferCorners from "@/components/OfferCorners";

const STEPS = [
  { n: "01", title: "Request a tour", body: "Request a tour. It takes less than a minute." },
  { n: "02", title: "Tour Scheduling", body: "Once approved, we will call/email with tour date and time." },
  { n: "03", title: "Leave", body: "Leave with a $20 MARTA card." },
] as const;

const OFFERS = [
  "Furnished Room with Personalized Access",
  "Water, Gas & Electricity",
  "Wifi & Laundry Included",
  "High-End Finishes & High Standard of Living",
  "Sober & Drug-Free Environment",
  "Access to Public Transportation",
  "Community Support",
  "Employment Assistance",
  "Benefits Navigation",
  "Community Connections",
  "On-Site Management and More!",
] as const;

const OFFER_ROWS = [OFFERS.slice(0, 6), OFFERS.slice(6)] as const;

export default function FreeMarta() {
  return (
    <div className="guide-page offer2-page has-corners marta-page">
      <OfferCorners />
      <div className="offer2-wrap marta-wrap">
        <Link href="/" className="guide-logo marta-logo" aria-label="New Creation Living">
          <BrandLogo clipId="martaClip" />
        </Link>

        <article className="marta-ad">
          <p className="marta-kicker">Free $20 MARTA card</p>
          <h1>
            <span className="marta-line">
              We&apos;ll <em>pay you</em>
            </span>
            <span className="marta-line">to tour our homes</span>
          </h1>
          <p className="marta-lead">
            Come see the house. Leave with a $20 MARTA card.
          </p>

          <div className="marta-ticket">
            <div>
              <span>Transit bonus</span>
              <strong>$20</strong>
              <em>MARTA card</em>
            </div>
            <p>
              <span className="marta-stamp">Free</span>
              Yours when you tour
            </p>
          </div>

          <Link href="/tour-eval" className="guide-offer-cta marta-cta">
            Claim my $20 MARTA card
          </Link>
          <p className="marta-aside">No lease. No deposit. You are only coming to look.</p>

          <ol className="marta-steps">
            {STEPS.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <strong className={step.n === "01" ? "marta-from" : undefined}>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <MartaArrow />

          <div className="marta-offers" aria-label="What the home includes">
            {OFFER_ROWS.map((row, rowIndex) => (
              <div className="marta-offer-row" key={row[0]}>
                <div className={rowIndex === 0 ? "marta-offer-track scroll-left" : "marta-offer-track scroll-right"}>
                  {[...row, ...row].map((item, index) => (
                    <span key={`${item}-${index}`} aria-hidden={index >= row.length}>
                      <em aria-hidden="true">✓</em>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="marta-home">
            One card per person who completes a tour. Call <a href="tel:+14047312371">(404) 731-2371</a>.
          </p>
        </article>
      </div>
    </div>
  );
}
