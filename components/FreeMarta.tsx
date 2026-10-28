import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import OfferCorners from "@/components/OfferCorners";

const STEPS = [
  { n: "01", title: "Ask", body: "Request a tour. A few minutes." },
  { n: "02", title: "Look", body: "Walk a furnished home. $798 a month, everything included." },
  { n: "03", title: "Take it", body: "Finish the tour. The $20 MARTA card is yours." },
] as const;

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
            Come see the house. Leave with a $20 MARTA card. The ride is the only thing we ask.
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

          <ol className="marta-path">
            {STEPS.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>

          <p className="marta-home">
            Furnished room, utilities, Wi-Fi, laundry, and on-site management. One card per person who completes a
            tour. Call <a href="tel:+14047312371">(404) 731-2371</a>.
          </p>
        </article>
      </div>
    </div>
  );
}
