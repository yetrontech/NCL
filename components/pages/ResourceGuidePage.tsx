"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import {
  DAYS,
  EDUCATION_PROGRAMS,
  FORMAT_CODES,
  MEETINGS,
  VOLUNTEER_OPPORTUNITIES,
  formatLabel,
  mapsHref,
  meetingsOn,
  telHref,
  type DayId,
  type FormatCode,
  type Meeting,
} from "@/lib/resource-guide";

type DayFilter = DayId | "all";

const CHIP_SKIP = new Set<FormatCode>(["TC", "JW", "WC"]);

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const closed = meeting.codes.includes("TC");
  const women = meeting.codes.includes("JW");
  const accessible = meeting.codes.includes("WC");
  const chips = meeting.codes.filter((code) => !CHIP_SKIP.has(code));
  const hasStreet = Boolean(meeting.address && /\d/.test(meeting.address));

  return (
    <article className={`rg-meeting${closed ? " is-closed" : ""}`}>
      <div className="rg-meeting-top">
        <p className="rg-when">
          <span>{meeting.time}</span>
          <span>{meeting.duration}</span>
        </p>
        <div className="rg-flags">
          {closed && <span className="rg-flag rg-flag-closed">Temporarily closed</span>}
          {women && <span className="rg-flag rg-flag-women">Just for women</span>}
          {accessible && <span className="rg-flag rg-flag-access">Wheelchair accessible</span>}
        </div>
      </div>
      <h3>{meeting.name}</h3>
      {meeting.place && <p className="rg-place">{meeting.place}</p>}
      {meeting.address && hasStreet && (
        <a
          className="rg-address"
          href={mapsHref(meeting.address)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {meeting.address}
        </a>
      )}
      {meeting.address && !hasStreet && <p className="rg-address-text">{meeting.address}</p>}
      {(meeting.zoomId || meeting.passcode) && (
        <p className="rg-zoom">
          {meeting.zoomId && (
            <span>
              Zoom ID <strong>{meeting.zoomId}</strong>
            </span>
          )}
          {meeting.passcode && (
            <span>
              Passcode <strong>{meeting.passcode}</strong>
            </span>
          )}
        </p>
      )}
      {chips.length > 0 && (
        <ul className="rg-chips">
          {chips.map((code) => (
            <li key={code}>{formatLabel(code)}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

export default function ResourceGuidePage({
  tagline,
  phone,
}: {
  tagline: string;
  phone: string;
}) {
  const [today, setToday] = useState<DayId | null>(null);
  const [day, setDay] = useState<DayFilter>("all");
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const [activeId, setActiveId] = useState("meetings");

  useEffect(() => {
    setToday(DAYS[new Date().getDay()].id);
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const matchedDay = DAYS.find((item) => item.id === hash || hash === `day-${item.id}`);
    if (matchedDay) {
      setDay(matchedDay.id);
      setPendingScroll(`day-${matchedDay.id}`);
      return;
    }
    setPendingScroll(hash);
  }, []);

  useEffect(() => {
    if (!pendingScroll) return;
    const frame = requestAnimationFrame(() => {
      scrollToSection(pendingScroll);
      setPendingScroll(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [pendingScroll, day]);

  useEffect(() => {
    const ids = [
      "meetings",
      "volunteer",
      "education",
      ...DAYS.map((item) => `day-${item.id}`),
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0.15, 0.4] }
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [day]);

  function goTo(id: string, nextDay?: DayFilter) {
    setActiveId(id);
    if (nextDay !== undefined && nextDay !== day) {
      setDay(nextDay);
      setPendingScroll(id);
      return;
    }
    scrollToSection(id);
  }

  const visibleDays = useMemo(
    () => (day === "all" ? DAYS : DAYS.filter((item) => item.id === day)),
    [day]
  );

  const visibleCount =
    day === "all" ? MEETINGS.length : meetingsOn(day).length;

  return (
    <div className="resource-page">
      <header className="onboarding-header">
        <Link href="/" className="brand">
          <div className="brand-logo" aria-hidden="true">
            <BrandLogo clipId="resourceClip" />
          </div>
          <div className="brand-text">
            <strong>New Creation Living</strong>
            <span>{tagline}</span>
          </div>
        </Link>
        <Link href="/" className="onboarding-exit">
          Back to site
        </Link>
      </header>

      <main className="rg-main">
        <section className="rg-hero">
          <span className="eyebrow">Resident resource guide</span>
          <h1>Meetings, volunteering & education</h1>
          <p>
            Your weekly job requirement can be met through recovery meetings, work,
            volunteering, or school. This guide lists real places across metro Atlanta
            for all of it. Talk to your house manager about which option fits you best.
          </p>
        </section>

        <nav className="rg-toc-bar" aria-label="Jump to a section">
          <a
            href="#meetings"
            className={activeId === "meetings" || activeId.startsWith("day-") ? "is-active" : undefined}
            onClick={(event) => {
              event.preventDefault();
              goTo("meetings", "all");
            }}
          >
            Meetings
          </a>
          <a
            href="#volunteer"
            className={activeId === "volunteer" || activeId.startsWith("volunteer-") ? "is-active" : undefined}
            onClick={(event) => {
              event.preventDefault();
              goTo("volunteer");
            }}
          >
            Volunteer
          </a>
          <a
            href="#education"
            className={activeId === "education" || activeId.startsWith("education-") ? "is-active" : undefined}
            onClick={(event) => {
              event.preventDefault();
              goTo("education");
            }}
          >
            School & GED
          </a>
        </nav>

        <div className="rg-layout">
          <nav className="rg-toc" aria-label="Table of contents">
            <p className="rg-toc-label">Contents</p>
            <a
              href="#meetings"
              className={`rg-toc-section${activeId === "meetings" || activeId.startsWith("day-") ? " is-active" : ""}`}
              onClick={(event) => {
                event.preventDefault();
                goTo("meetings", "all");
              }}
            >
              AA / NA meetings
            </a>
            <ul className="rg-toc-days">
              <li>
                <a
                  href="#meetings"
                  className={day === "all" && activeId === "meetings" ? "is-active" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo("meetings", "all");
                  }}
                >
                  All week
                </a>
              </li>
              {DAYS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#day-${item.id}`}
                    className={activeId === `day-${item.id}` ? "is-active" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(`day-${item.id}`, item.id);
                    }}
                  >
                    {item.label}
                    {item.id === today && <span className="rg-today">Today</span>}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#volunteer"
              className={`rg-toc-section${activeId === "volunteer" || activeId.startsWith("volunteer-") ? " is-active" : ""}`}
              onClick={(event) => {
                event.preventDefault();
                goTo("volunteer");
              }}
            >
              Volunteer opportunities
            </a>
            <ol className="rg-toc-items">
              {VOLUNTEER_OPPORTUNITIES.map((item, index) => (
                <li key={item.name}>
                  <a
                    href={`#volunteer-${index + 1}`}
                    className={activeId === `volunteer-${index + 1}` ? "is-active" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(`volunteer-${index + 1}`);
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ol>

            <a
              href="#education"
              className={`rg-toc-section${activeId === "education" || activeId.startsWith("education-") ? " is-active" : ""}`}
              onClick={(event) => {
                event.preventDefault();
                goTo("education");
              }}
            >
              School, certifications & GED
            </a>
            <ol className="rg-toc-items">
              {EDUCATION_PROGRAMS.map((item, index) => (
                <li key={item.name}>
                  <a
                    href={`#education-${index + 1}`}
                    className={activeId === `education-${index + 1}` ? "is-active" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(`education-${index + 1}`);
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="rg-body">
        <section className="rg-section" id="meetings">
          <div className="rg-section-head">
            <span className="eyebrow">Section 1</span>
            <h2>AA / NA meeting schedule</h2>
            <p>
              Please verify before you go. Meeting times, locations, and Zoom details
              change often. This schedule was transcribed from a printed metro Atlanta
              meeting list. Confirm with the meeting, or check{" "}
              <a href="https://na-atlanta.org" target="_blank" rel="noopener noreferrer">
                na-atlanta.org
              </a>{" "}
              and{" "}
              <a href="https://aa-atlanta.org" target="_blank" rel="noopener noreferrer">
                aa-atlanta.org
              </a>
              , before a first visit.
            </p>
          </div>

          <div className="rg-days" role="toolbar" aria-label="Filter meetings by day">
            <button
              type="button"
              className={day === "all" ? "is-active" : undefined}
              aria-pressed={day === "all"}
              onClick={() => setDay("all")}
            >
              All week
            </button>
            {DAYS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={day === item.id ? "is-active" : undefined}
                aria-pressed={day === item.id}
                onClick={() => setDay(item.id)}
              >
                {item.label}
                {item.id === today && <span className="rg-today">Today</span>}
              </button>
            ))}
          </div>
          <p className="rg-count">
            {visibleCount} {visibleCount === 1 ? "meeting" : "meetings"}
          </p>

          {visibleDays.map((item) => {
            const meetings = meetingsOn(item.id);
            return (
              <div className="rg-day" id={`day-${item.id}`} key={item.id}>
                <h3>
                  {item.label} <span>/ {item.es}</span>
                </h3>
                <div className="rg-meetings">
                  {meetings.map((meeting) => (
                    <MeetingCard
                      key={`${meeting.day}-${meeting.time}-${meeting.name}`}
                      meeting={meeting}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="rg-legend">
            <h3>Format codes</h3>
            <ul>
              {FORMAT_CODES.map((item) => (
                <li key={item.code}>
                  <strong>{item.code}</strong>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rg-section" id="volunteer">
          <div className="rg-section-head">
            <span className="eyebrow">Section 2</span>
            <h2>Volunteer opportunities</h2>
            <p>All free. No experience required. Metro Atlanta.</p>
          </div>
          <div className="rg-cards">
            {VOLUNTEER_OPPORTUNITIES.map((item, index) => (
              <article className="rg-card" id={`volunteer-${index + 1}`} key={item.name}>
                <span className="rg-index">{index + 1}</span>
                <h3>{item.name}</h3>
                <p>{item.summary}</p>
                {item.address && (
                  <a
                    className="rg-address"
                    href={mapsHref(item.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.address}
                  </a>
                )}
                {item.phone && (
                  <a className="rg-phone" href={telHref(item.phone)}>
                    {item.phone}
                  </a>
                )}
                {item.link && (
                  <a
                    className="rg-ext"
                    href={item.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.link.label}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="rg-section" id="education">
          <div className="rg-section-head">
            <span className="eyebrow">Section 3</span>
            <h2>Trade schools, certifications & GED</h2>
            <p>Free or low-cost. Built for a resident&apos;s budget, not four-year degree pricing.</p>
          </div>
          <div className="rg-cards">
            {EDUCATION_PROGRAMS.map((item, index) => (
              <article className="rg-card" id={`education-${index + 1}`} key={item.name}>
                <div className="rg-card-top">
                  <span className="rg-index">{index + 1}</span>
                  {item.tag && <span className="rg-tag">{item.tag}</span>}
                </div>
                <h3>{item.name}</h3>
                <p>{item.summary}</p>
                {item.address && (
                  <a
                    className="rg-address"
                    href={mapsHref(item.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.address}
                  </a>
                )}
                {item.phone && (
                  <a className="rg-phone" href={telHref(item.phone)}>
                    {item.phone}
                  </a>
                )}
                {item.link && (
                  <a
                    className="rg-ext"
                    href={item.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.link.label}
                  </a>
                )}
              </article>
            ))}
          </div>
          <p className="rg-note">
            Programs, hours, and eligibility rules change. Confirm current details by
            calling ahead before a first visit. This list was researched and verified as
            of 2026 and should be checked periodically.
          </p>
        </section>

        <p className="rg-close">
          New Creation Living ·{" "}
          <a href={telHref(phone)}>{phone}</a>
          {" · "}
          {tagline}
        </p>
          </div>
        </div>
      </main>
    </div>
  );
}
