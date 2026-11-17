"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import BedCount from "@/components/BedCount";
import BrandLogo from "@/components/BrandLogo";
import OfferCorners from "@/components/OfferCorners";
import { offerDeadline } from "@/components/OfferUntil";
import { SiteContentProvider, useCopy, useCopyList } from "@/components/SiteContentProvider";
import { TrackedLink } from "@/components/TrackedLink";
import type { SiteContentMap } from "@/lib/site-content";

function withDate(value: string) {
  return value.replaceAll("{date}", offerDeadline());
}

function marked(value: string): ReactNode[] {
  return value.split(/(\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <span className="offer-hit" key={index}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}

function programsFrom(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      return { title: lines[0] || "", body: lines.slice(1).join(" ") };
    })
    .filter((program) => program.title);
}

function OfferOneBody({ bedsRemaining }: { bedsRemaining: number | null }) {
  const copy = useCopy();
  const list = useCopyList();
  const programs = programsFrom(copy("offer1.programs"));
  const paragraphs = copy("offer1.body")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const more = copy("offer1.more").trim();
  const homeTitle = copy("offer1.home_title").trim();
  const homeItems = list("offer1.home_items");
  const quotes = list("offer1.quotes");
  const futureTitle = copy("offer1.future_title").trim();
  const futureLead = copy("offer1.future_lead").trim();
  const sale = copy("offer1.sale").trim();

  return (
    <div className="guide-page offer2-page has-corners">
      <OfferCorners />
      <div className="offer2-wrap">
        <Link href="/" className="guide-logo" aria-label="New Creation Living">
          <BrandLogo clipId="offer1Clip" />
        </Link>
        <article className="guide-card offer2-card">
          <BedCount initial={bedsRemaining} />
          <h1>{marked(withDate(copy("offer1.headline")))}</h1>
          {copy("offer1.package").trim() ? <p className="offer2-package">{copy("offer1.package")}</p> : null}
          {copy("offer1.until").trim() ? <p className="offer2-package">{marked(withDate(copy("offer1.until")))}</p> : null}
          <TrackedLink href="/quickeval/check" click="offer_fit" className="guide-offer-cta offer2-fit">
            {copy("offer1.cta")}
          </TrackedLink>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{marked(withDate(paragraph))}</p>
          ))}
          {more ? <p className="offer2-more">{marked(withDate(more))}</p> : null}
          {programs.length ? (
            <div className="offer2-programs">
              {programs.map((program) => (
                <section key={program.title}>
                  <h2>{program.title}</h2>
                  {program.body ? <p>{marked(withDate(program.body))}</p> : null}
                </section>
              ))}
            </div>
          ) : null}
          {homeTitle ? <h2>{homeTitle}</h2> : null}
          {homeItems.length ? (
            <ul className="offer2-chips">
              {homeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {futureTitle ? <h2>{futureTitle}</h2> : null}
          {futureLead ? <p>{futureLead}</p> : null}
          {quotes.length ? (
            <ul className="guide-offer-quotes">
              {quotes.map((quote) => (
                <li key={quote}>{quote}</li>
              ))}
            </ul>
          ) : null}
          {sale ? <p className="offer2-sale">{marked(withDate(sale))}</p> : null}
        </article>
        <p className="guide-footer">New Creation Living · Atlanta, GA · newcreationliving.org · (404) 731-2371</p>
      </div>
    </div>
  );
}

export default function OfferOne({
  content,
  bedsRemaining,
}: {
  content: SiteContentMap;
  bedsRemaining: number | null;
}) {
  return (
    <SiteContentProvider content={content}>
      <OfferOneBody bedsRemaining={bedsRemaining} />
    </SiteContentProvider>
  );
}
