"use client";

import { useEffect, useRef, useState } from "react";
import GuideOffer from "@/components/GuideOffer";

const DISMISS_KEY = "ncl-offer-dismissed";

export default function OfferPopup({ bedsRemaining }: { bedsRemaining: number | null }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.classList.add("offer-open");

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeOffer();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("offer-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function closeOffer() {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // A private-browsing block still closes the dialog for this view.
    }
    setOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  }

  return (
    <>
      {open ? (
        <div className="offer-popup-backdrop" onClick={closeOffer}>
          <div
            className="offer-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="limited-space-offer"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="offer-popup-close"
              onClick={closeOffer}
              aria-label="Close offer"
            >
              ×
            </button>
            <GuideOffer bedsRemaining={bedsRemaining} />
          </div>
        </div>
      ) : null}
      <button
        ref={launcherRef}
        type="button"
        className="offer-launcher"
        hidden={open}
        onClick={() => setOpen(true)}
      >
        Limited Space Offer
      </button>
    </>
  );
}
