import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import MartaArrow from "@/components/MartaArrow";
import OfferCorners from "@/components/OfferCorners";
import { TOUR_REWARDS } from "@/lib/quick-eval";

const STEPS = [
  { n: "01", title: "Request a tour", body: "Request a tour. It takes less than a minute." },
  { n: "02", title: "Tour Scheduling", body: "Once approved, we will call/email with tour date and time." },
  {
    n: "03",
    title: "Choose",
    body: "At the end, pick a $20 MARTA card, a $20 Gift Card for Gas, or a package kit with a tire inflator, car charger, and phone mount.",
  },
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

export default function TourGift() {
  return (
    <div className="guide-page offer2-page has-corners marta-page">
      <OfferCorners />
      <div className="offer2-wrap marta-wrap">
        <Link href="/" className="guide-logo marta-logo" aria-label="New Creation Living">
          <BrandLogo clipId="tourGiftClip" />
        </Link>

        <article className="marta-ad">
          <p className="marta-kicker">Choose your tour gift</p>
          <h1>
            <span className="marta-line">
              Pick your <em>gift</em>
            </span>
            <span className="marta-line">when you tour</span>
          </h1>
          <p className="marta-lead">
            Schedule a tour. At the end, choose what you take home.
          </p>

          <div className="marta-ticket">
            <div>
              <span>Pick one</span>
              <ul className="marta-gifts">
                {TOUR_REWARDS.map((gift) => (
                  <li key={gift}>{gift}</li>
                ))}
              </ul>
            </div>
            <p>
              <span className="marta-stamp">Free</span>
              Yours when you tour
            </p>
          </div>

          <Link href="/tour-eval" className="guide-offer-cta marta-cta">
            Schedule a tour
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
            One gift per person who completes a tour. Call <a href="tel:+14047312371">(404) 731-2371</a>.
          </p>
        </article>
      </div>
    </div>
  );
}
