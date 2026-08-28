"use client";

import { useEffect, useState, type FormEvent } from "react";
import { submitTourRequest } from "@/app/actions/forms";
import { trackGoogleAdsContactConversion } from "@/lib/google-ads";

const GENDER_OPTIONS = ["Male", "Female"];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function TourModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setStatus("idle");
  }, [open]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const data = new FormData(e.currentTarget);
    setStatus("submitting");

    const result = await submitTourRequest(data);
    if (result.ok) {
      trackGoogleAdsContactConversion();
      setStatus("success");
    } else {
      console.error("Tour request submission failed:", result.error);
      setStatus("error");
    }
  }

  return (
    <div
      id="tourModal"
      className={`form-modal${open ? " open" : ""}`}
      aria-hidden={!open}
      role="dialog"
      aria-label="Schedule a Tour"
      aria-modal="true"
    >
      <div className="form-modal-backdrop" onClick={onClose}></div>
      <div className="form-modal-dialog">
        <button
          className="form-modal-close"
          type="button"
          aria-label="Close schedule form"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="form-card" style={{ border: "none", padding: 0 }}>
          <h3>Schedule a Tour</h3>
          <p>Tell us a bit about yourself and when you&apos;d like to visit.</p>

          <form
            id="tourForm"
            onSubmit={handleSubmit}
            style={status === "success" ? { display: "none" } : undefined}
          >
            <div className="field-row">
              <div className="field">
                <label htmlFor="tour-first">First name</label>
                <input type="text" id="tour-first" name="tour-first" required />
              </div>
              <div className="field">
                <label htmlFor="tour-last">Last name</label>
                <input type="text" id="tour-last" name="tour-last" required />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="tour-phone">Phone number</label>
                <input type="tel" id="tour-phone" name="tour-phone" required />
              </div>
              <div className="field">
                <label htmlFor="tour-email">Email address</label>
                <input type="text" id="tour-email" name="tour-email" required />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="tour-date">Preferred tour date</label>
                <input type="date" id="tour-date" name="tour-date" required />
              </div>
              <div className="field">
                <label htmlFor="tour-gender">Gender</label>
                <select id="tour-gender" name="tour-gender" required defaultValue="">
                  <option value="">Select one</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting..." : "Request Tour"}
            </button>
            {status === "error" && (
              <p className="form-note" style={{ color: "#C0392B" }}>
                Something went wrong. Please try again or call (404) 731-2371.
              </p>
            )}
            <p className="form-note">We&apos;ll confirm your tour time by phone or email.</p>
          </form>

          <div className={`confirm-box${status === "success" ? " show" : ""}`} id="tour-confirm">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
            <h4>Tour request received</h4>
            <p>
              Thank you. Our team will follow up shortly to confirm. For anything urgent, call
              (404) 731-2371.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
