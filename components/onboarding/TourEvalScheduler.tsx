"use client";

import { useEffect, useState } from "react";
import { listTourSlots } from "@/app/actions/forms";
import { bookApprovedTour } from "@/app/actions/tour-eval";

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

export default function TourEvalScheduler({
  token,
  firstName,
}: {
  token: string;
  firstName: string;
}) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [booked, setBooked] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      setTime("");
      setNote(null);
      return;
    }
    let cancelled = false;
    void listTourSlots(date).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setSlots([]);
        setTime("");
        setNote(result.error);
        return;
      }
      setSlots(result.slots);
      setTime("");
      if (!result.configured) {
        setNote("Tour times are not posted yet. Call (404) 731-2371.");
        return;
      }
      setNote(result.slots.length === 0 ? "No open times that day. Try another date." : null);
    });
    return () => {
      cancelled = true;
    };
  }, [date]);

  if (booked) {
    return (
      <p className="schedule-lead">
        {firstName}, your tour is requested for {formatDate(booked.date)} at {formatSlot(booked.time)}. We will
        confirm by phone or email.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setBusy(true);
        setError(null);
        void bookApprovedTour(token, date, time).then((result) => {
          setBusy(false);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setBooked({ date, time });
        });
      }}
    >
      <p className="schedule-lead">Pick a date and a time. This link is just for you, {firstName}.</p>
      <div className="field-row">
        <div className="field">
          <label htmlFor="eval-date">Tour date</label>
          <input
            id="eval-date"
            type="date"
            required
            min={todayKey()}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="eval-time">Tour time</label>
          <select id="eval-time" required value={time} onChange={(event) => setTime(event.target.value)}>
            <option value="">{slots.length ? "Select a time" : "Select a date"}</option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {formatSlot(slot)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {note ? <p className="form-note">{note}</p> : null}
      {error ? <p className="form-note" style={{ color: "#C0392B" }}>{error}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Scheduling…" : "Schedule my tour"}
      </button>
    </form>
  );
}
