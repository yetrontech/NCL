"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { listTourSlots, submitTourRequest } from "@/app/actions/forms";
import { trackGoogleAdsContactConversion } from "@/lib/google-ads";
import { trackMetaSchedule } from "@/lib/meta-pixel";

const GENDER_OPTIONS = ["Male", "Female"];

type FormStatus = "idle" | "submitting" | "success" | "error";

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatSlot(value: string) {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function TourModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [slotNote, setSlotNote] = useState<string | null>(null);
  const [bookedLabel, setBookedLabel] = useState<string | null>(null);

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
    if (!open) {
      setStatus("idle");
      setError(null);
      setGender("");
      setDate("");
      setSlots([]);
      setTime("");
      setSlotNote(null);
      setBookedLabel(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    void listTourSlots(date).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setSlots([]);
        setSlotNote(result.error);
        return;
      }
      setSlots(result.slots);
      setTime("");
      if (!result.configured) {
        setSlotNote("Tour times are not posted yet. Call (404) 731-2371.");
        return;
      }
      setSlotNote(result.slots.length === 0 ? "No open times that day. Pick another date." : null);
    });
    return () => {
      cancelled = true;
    };
  }, [open, date]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const data = new FormData(e.currentTarget);
    setStatus("submitting");
    setError(null);

    const result = await submitTourRequest(data);
    if (result.ok) {
      trackGoogleAdsContactConversion();
      trackMetaSchedule();
      setBookedLabel(date && time ? `${formatDate(date)} at ${formatSlot(time)}` : null);
      setStatus("success");
    } else {
      console.error("Tour request submission failed:", result.error);
      setError(result.error);
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
          <p>Tell us a bit about yourself and pick a time that is already open.</p>

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
                <label htmlFor="tour-gender">Gender</label>
                <select
                  id="tour-gender"
                  name="tour-gender"
                  required
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                >
                  <option value="">Select one</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="tour-date">Tour date</label>
                <input
                  type="date"
                  id="tour-date"
                  name="tour-date"
                  required
                  min={todayKey()}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="tour-time">Tour time</label>
              <select id="tour-time" name="tour-time" required value={time} onChange={(event) => setTime(event.target.value)}>
                <option value="">{slots.length ? "Select a time" : "Select a date"}</option>
                  {slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatSlot(slot)}
                    </option>
                  ))}
              </select>
            </div>
            <button type="submit" className="submit-btn" disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting..." : "Request Tour"}
            </button>
            {slotNote ? <p className="form-note">{slotNote}</p> : null}
            {status === "error" && (
              <p className="form-note" style={{ color: "#C0392B" }}>
                {error || "Something went wrong. Please try again or call (404) 731-2371."}
              </p>
            )}
            <p className="form-note">
              We&apos;ll confirm your tour time by phone or email. See our{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </form>

          <div className={`confirm-box${status === "success" ? " show" : ""}`} id="tour-confirm">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
            <h4>Tour request received</h4>
            <p>
              {bookedLabel
                ? `Thank you. Your tour is requested for ${bookedLabel}. We will confirm by phone or email.`
                : "Thank you. Our team will follow up shortly to confirm."}{" "}
              For anything urgent, call (404) 731-2371.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
