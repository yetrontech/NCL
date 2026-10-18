"use client";

import { useEffect, useState } from "react";
// import Link from "next/link";
import BedCount from "@/components/BedCount";
import { scrollToId, scrollToSection } from "@/lib/scroll";
import { useCopy, useCopyList } from "@/components/SiteContentProvider";

const HERO_SLIDES = [
  "/img/IhmE7JRA.jpeg",
  "/img/s4HJJoUA.jpeg",
  "/img/y4YPXGDQ.jpeg",
  "/img/zY7wDXjw.jpeg",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function HomePage({ bedsRemaining }: { bedsRemaining: number | null }) {
  const copy = useCopy();
  const copyList = useCopyList();
  const [activeSlide, setActiveSlide] = useState(0);
  const costItems = copyList("home.cost.items");
  const recipients = copyList("home.serve.recipients");
  const partnerRow1 = copyList("home.partners.row1");
  const partnerRow2 = copyList("home.partners.row2");

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleScheduleTour = () => {
    scrollToSection("referral");
    setTimeout(() => {
      const el = document.getElementById("schedule-tour");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <div className="page" id="page-home">
      <section className="hero">
        <div className="hero-slides">
          {HERO_SLIDES.map((src, index) => (
            <div
              key={src}
              className={`hero-slide${index === activeSlide ? " active" : ""}`}
              style={{ backgroundImage: `url('${src}')` }}
            ></div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-inner">
          <div>
            <span className="hero-provider-tag">
              <svg viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {copy("home.hero.tag")}
            </span>
            <h1
              style={{
                fontSize: "clamp(2.8rem, 5vw, 4rem)",
                marginTop: 4,
                marginBottom: 12,
                lineHeight: 1.1,
              }}
            >
              {copy("home.hero.headline")}
            </h1>
            <p
              className="lead"
              style={{
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--navy)",
                marginBottom: 14,
                lineHeight: 1.35,
              }}
            >
              {copy("home.hero.lead")}
            </p>
            <p
              style={{
                fontSize: "1.25rem",
                color: "var(--gold)",
                fontWeight: 800,
                marginBottom: 26,
                textTransform: "uppercase",
                letterSpacing: "1.2px",
              }}
            >
              {copy("home.hero.locations")}
            </p>
            <div className="hero-beds">
              <BedCount initial={bedsRemaining} />
            </div>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={() => scrollToId("apply-options")}>
                {copy("home.hero.cta_residency")}
              </button>
              <button className="btn btn-ghost" onClick={handleScheduleTour}>
                {copy("home.hero.cta_tour")}
              </button>
            </div>
          </div>
          <div
            className="cost-card"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "32px 34px",
            }}
          >
            <h3
              style={{
                color: "var(--gold-light)",
                fontFamily: "'Fraunces', serif",
                fontSize: "1.85rem",
                marginBottom: 16,
                textAlign: "center",
                borderBottom: "2px solid rgba(201, 168, 76, 0.4)",
                paddingBottom: 12,
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              {copy("home.cost.title")}
            </h3>
            <div className="cost-rows" style={{ marginBottom: 16 }}>
              {costItems.map((item, index) => (
                <div
                  key={item}
                  className="cost-row"
                  style={{
                    borderBottom:
                      index === costItems.length - 1
                        ? "none"
                        : "1px solid rgba(255,255,255,0.12)",
                    padding: "7px 0",
                    fontSize: "1.08rem",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.92)" }}>✓ {item}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", borderTop: "2px solid var(--gold)", paddingTop: 14 }}>
              <div
                className="cost-big"
                style={{
                  fontSize: "3.8rem",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                {" "}
                <span style={{ color: "#FF5252", fontSize: "1.05em", fontWeight: 800 }}>
                  {copy("home.cost.price")}
                </span>
                <span style={{ fontSize: "1.4rem", color: "var(--gold-light)", fontWeight: 700 }}>
                  {copy("home.cost.period")}
                </span>
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.92)",
                  fontSize: "0.98rem",
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                {copy("home.cost.note")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="philosophy" className="band alt">
        <div className="wrap">
          <div className="philosophy-showcase">
            <div className="philosophy-content">
              <span className="eyebrow">{copy("home.philosophy.eyebrow")}</span>
              <h2 className="philosophy-title">
                {copy("home.philosophy.title")}
              </h2>
              <p className="philosophy-lead">
                {copy("home.philosophy.lead")}
              </p>

              <div className="philosophy-pillars">
                <div className="phil-pillar">
                  <div className="phil-pillar-icon">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                  </div>
                  <div className="phil-pillar-body">
                    <h3>{copy("home.philosophy.pillar1_title")}</h3>
                    <p>{copy("home.philosophy.pillar1_body")}</p>
                  </div>
                </div>

                <div className="phil-pillar">
                  <div className="phil-pillar-icon">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                      <path d="M4 21V8l8-5 8 5v13M9 21v-6h6v6" />
                    </svg>
                  </div>
                  <div className="phil-pillar-body">
                    <h3>{copy("home.philosophy.pillar2_title")}</h3>
                    <p>{copy("home.philosophy.pillar2_body")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="philosophy-image-container">
              <div className="philosophy-image-wrapper">
                <img
                  src="/img/MaLg3QiA.jpeg"
                  alt="High-end home interior with warm light and staged furniture"
                  className="philosophy-img"
                />
                <div className="philosophy-image-badge">
                  <div className="badge-icon">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div className="badge-text" style={{ flex: 1 }}>
                    <strong>{copy("home.philosophy.badge")}</strong>
                    <span style={{ display: "none" }}>Atlanta &amp; Middle GA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="whowe-serve" style={{ marginBottom: 40 }}>
            <div>
              <h3>{copy("home.serve.title")}</h3>
              <p>{copy("home.serve.body")}</p>
            </div>
            <div className="recipient-grid">
              {recipients.map((label) => (
                <div className="recipient-card" key={label}>
                  <div className="recipient-check">
                    <CheckIcon />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="partner-card">
            <div>
              <h3
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.8rem",
                  color: "var(--navy)",
                  marginBottom: 14,
                }}
              >
                {copy("home.partners.title")}
              </h3>
              <p style={{ color: "#5B6478", fontSize: "1rem", marginBottom: 0 }}>
                {copy("home.partners.body")}
              </p>
            </div>

            <div className="partner-carousel-container">
              {/* Row 1: scrolls left */}
              <div className="partner-carousel-row">
                <div className="partner-track scroll-left">
                  {/* Duplicated set for seamless loop */}
                  {[...partnerRow1, ...partnerRow1].map((tag, index) => (
                    <span className="tag" key={`${tag}-${index}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 2: scrolls right */}
              <div className="partner-carousel-row">
                <div className="partner-track scroll-right">
                  {[...partnerRow2, ...partnerRow2].map((tag, index) => (
                    <span className="tag" key={`${tag}-${index}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BENEFITS ASSISTANCE SECTION (temporarily hidden) ============
      <section
        className="band alt"
        style={{
          background: "var(--navy)",
          color: "white",
          border: "none",
          backgroundImage:
            "radial-gradient(ellipse 900px 500px at 15% -10%, rgba(201,168,76,0.1), transparent)",
        }}
      >
        <div className="wrap">
          <div className="split" style={{ alignItems: "center" }}>
            <div>
              <span
                className="eyebrow"
                style={{
                  background: "rgba(201,168,76,0.2)",
                  color: "var(--gold-light)",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                Benefits Assistance
              </span>
              <h2
                style={{
                  color: "white",
                  fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
                  marginTop: 10,
                  marginBottom: 18,
                }}
              >
                We Help You Navigate Benefits
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "1.1rem",
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                Countless people are eligible for benefits they haven't yet claimed. We assist with
                Supplemental Security Income (SSI), Social Security Disability Insurance (SSDI), and
                VA Pension.
              </p>
              <Link
                href="/benefits"
                className="btn"
                style={{ background: "var(--gold)", color: "var(--navy-deep)", fontWeight: 700 }}
              >
                Get my benefits
              </Link>
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                </div>
                <h4>Free Screening</h4>
                <p>Find out which benefits you qualify for at no cost.</p>
                <div className="screening-benefits-list">
                  {["2-Minute Evaluation", "Vetted by Attorneys", "Zero Out-of-Pocket"].map(
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
        </div>
      </section>
      */}
    </div>
  );
}
