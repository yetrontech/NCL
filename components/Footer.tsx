"use client";

import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { scrollToId, scrollToSection } from "@/lib/scroll";
import { useCopy } from "@/components/SiteContentProvider";

const FOOTER_LINKS: { page: string; label: string; href?: string; scrollId?: string }[] = [
  { page: "about", label: "About Us" },
  { page: "life", label: "Life at NCL" },
  { page: "resources", label: "Resident Resources", href: "/resources" },
  { page: "benefits", label: "Get Benefits", href: "/benefits" },
  { page: "faq", label: "FAQ" },
  { page: "referral", label: "Residency", scrollId: "apply-options" },
  { page: "locations", label: "Locations" },
];

export default function Footer() {
  const copy = useCopy();
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="brand">
            <div className="brand-logo">
              <BrandLogo clipId="cardClipFooter" />
            </div>
            <div className="brand-text">
              <strong style={{ color: "white" }}>New Creation Living</strong>
              <span>{copy("brand.tagline")}</span>
            </div>
          </div>
          <p>{copy("footer.blurb")}</p>
        </div>
        <div>
          <h5>Navigate</h5>
          <ul>
            {FOOTER_LINKS.map(({ page, label, href, scrollId }) => (
              <li key={page}>
                {href ? (
                  <Link href={href}>{label}</Link>
                ) : (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (scrollId) {
                        scrollToId(scrollId);
                        return;
                      }
                      scrollToSection(page);
                    }}
                  >
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>Contact</h5>
          <ul>
            <li>{copy("footer.contact_phone")}</li>
            <li>{copy("footer.contact_email")}</li>
            <li>{copy("footer.contact_area")}</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 New Creation Living. All rights reserved.</span>
        <span>
          <Link href="/privacy" className="footer-credit-link">
            Privacy Policy
          </Link>
        </span>
        <span>
          Built by{" "}
          <a
            href="https://yetrontech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-credit-link"
          >
            yetrontech.com
          </a>
        </span>
        <span>{copy("footer.disclaimer")}</span>
      </div>
    </footer>
  );
}
