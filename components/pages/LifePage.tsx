"use client";

import Link from "next/link";
import { scrollToId } from "@/lib/scroll";
import { useCopy, useCopyList } from "@/components/SiteContentProvider";

export default function LifePage() {
  const copy = useCopy();
  const copyList = useCopyList();
  const rewardItems = copyList("life.rewards_items");
  return (
    <div className="page" id="page-life">
      <section
        className="band alt"
        style={{
          background: "var(--navy)",
          color: "white",
          border: "none",
          backgroundImage:
            "radial-gradient(ellipse 900px 500px at 15% -10%, rgba(201,168,76,0.1), transparent)",
          paddingTop: 56,
        }}
      >
        <div className="wrap">
          <div className="split" style={{ alignItems: "center", marginBottom: 64 }}>
            <div>
              <span
                className="eyebrow"
                style={{
                  background: "rgba(201,168,76,0.2)",
                  color: "var(--gold-light)",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                {copy("life.eyebrow")}
              </span>
              <h2
                style={{
                  color: "white",
                  fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
                  marginTop: 10,
                  marginBottom: 18,
                }}
              >
                {copy("life.title")}
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "1.1rem",
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                {copy("life.body")}
              </p>
              <button
                type="button"
                className="btn"
                style={{ background: "var(--gold)", color: "var(--navy-deep)", fontWeight: 700 }}
                onClick={() => scrollToId("apply-options")}
              >
                {copy("life.cta")}
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                width: "100%",
              }}
            >
              <div className="free-screening-card">
                <div className="screening-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
                <h4>{copy("life.rewards_title")}</h4>
                <p>{copy("life.rewards_body")}</p>
                <div className="screening-benefits-list">
                  {rewardItems.map(
                    (item) => (
                      <div className="screening-benefit-item" key={item}>
                        <svg viewBox="0 0 24 24" fill="none">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{item}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="sec-head" style={{ marginBottom: 36 }}>
            <span
              className="eyebrow"
              style={{
                background: "rgba(201,168,76,0.2)",
                color: "var(--gold-light)",
                border: "1px solid rgba(201,168,76,0.3)",
              }}
            >
              {copy("life.culture.eyebrow")}
            </span>
            <h2 style={{ color: "white" }}>{copy("life.culture.title")}</h2>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.8)" }}>
              {copy("life.culture.lead")}
            </p>
          </div>
          <div className="culture-grid">
            <div className="culture-card">
              <span className="culture-tag">{copy("life.card1.tag")}</span>
              <h3>{copy("life.card1.title")}</h3>
              <p>{copy("life.card1.body")}</p>
            </div>
            <div className="culture-card">
              <span className="culture-tag">{copy("life.card2.tag")}</span>
              <h3>{copy("life.card2.title")}</h3>
              <p>{copy("life.card2.body")}</p>
            </div>
            <div className="culture-card">
              <span className="culture-tag">{copy("life.card3.tag")}</span>
              <h3>{copy("life.card3.title")}</h3>
              <p>{copy("life.card3.body")}</p>
            </div>
          </div>

          <div className="life-resource">
            <div>
              <span className="culture-tag">For residents</span>
              <h2>Meetings, volunteering & education</h2>
              <p>
                Your weekly requirement can be met through recovery meetings, work,
                volunteering, or school. The resident guide lists real places across
                metro Atlanta.
              </p>
              <Link href="/resources" className="btn life-resource-cta">
                Open the resource guide
              </Link>
            </div>
            <div className="life-resource-links">
              <Link href="/resources#meetings">AA / NA meeting schedule</Link>
              <Link href="/resources#volunteer">Free volunteer shifts</Link>
              <Link href="/resources#education">GED, certifications & trade programs</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
