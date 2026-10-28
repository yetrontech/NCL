import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import OfferCorners from "@/components/OfferCorners";

const STEPS = [
  { n: "1", title: "Ask for a tour", body: "Tell us you want to see the house. It takes a few minutes." },
  { n: "2", title: "Come look", body: "Walk the home. Ask what $798 a month actually covers." },
  { n: "3", title: "Take the card", body: "Finish the tour and the $20 MARTA card is yours." },
] as const;

const INCLUDED = ["Furnished room", "Utilities", "Wi-Fi", "Laundry", "On-site management", "MARTA nearby"];

export default function FreeMarta() {
  return (
    <div className="guide-page offer2-page has-corners marta-page">
      <OfferCorners />
      <div className="offer2-wrap">
        <Link href="/" className="guide-logo" aria-label="New Creation Living">
          <BrandLogo clipId="martaClip" />
        </Link>

        <article className="guide-card offer2-card marta-hero">
          <p className="guide-kicker">Free $20 MARTA card</p>
          <h1>
            We&apos;ll pay you to <span className="offer-hit">tour</span> our homes
          </h1>
          <p className="marta-lead">
            Come see all-inclusive housing in Atlanta. If you take the tour, you leave with a $20 MARTA card.
            The ride over is the only thing we need from you.
          </p>

          <div className="marta-ticket" aria-hidden="true">
            <div>
              <span>Transit bonus</span>
              <strong>$20</strong>
              <em>MARTA card</em>
            </div>
            <p>Yours when you tour</p>
          </div>

          <Link href="/tour-eval" className="guide-offer-cta">
            Claim my $20 MARTA card
          </Link>
          <p className="marta-aside">No lease. No deposit. You are only coming to look.</p>
        </article>

        <article className="guide-card offer2-card">
          <h2>How the card works</h2>
          <ol className="marta-steps">
            {STEPS.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="guide-card offer2-card">
          <h2>What you are coming to see</h2>
          <p>
            A furnished home for <span className="offer-hit">$798 a month</span>, everything included. You find
            out in person whether it is the right fit. The $20 card means that visit does not cost you the fare.
          </p>
          <ul className="offer2-chips">
            {INCLUDED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link href="/tour-eval" className="guide-offer-cta">
            Tour today. Get the MARTA card.
          </Link>
          <p className="marta-fine">
            One $20 MARTA card per person who completes a tour. Questions? Call{" "}
            <a href="tel:+14047312371">(404) 731-2371</a>.
          </p>
        </article>

        <p className="guide-footer">New Creation Living · Atlanta, GA · newcreationliving.org · (404) 731-2371</p>
      </div>
    </div>
  );
}
