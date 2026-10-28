"use client";

import { useEffect, useState } from "react";
import { listTourHouses, listTourSlots } from "@/app/actions/forms";
import { bookApprovedTour } from "@/app/actions/tour-eval";

function formatSlot(value: string) {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export default function TourEvalScheduler({
  token,
  firstName,
  gender,
}: {
  token: string;
  firstName: string;
  gender: "Male" | "Female";
}) {
  const [houses, setHouses] = useState<Array<{ id: string; name: string }>>([]);
  const [houseId, setHouseId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [bookedHouse, setBookedHouse] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listTourHouses(gender).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setNote(result.error);
        return;
      }
      setHouses(result.houses);
      setNote(result.houses.length === 0 ? "No houses are open for tours right now." : null);
    });
    return () => {
      cancelled = true;
    };
  }, [gender]);

  useEffect(() => {
    if (!houseId || !date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    void listTourSlots(houseId, date).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setSlots([]);
        setNote(result.error);
        return;
      }
      setSlots(result.slots);
      setNote(result.slots.length === 0 ? "No open times that day. Try another date." : null);
    });
    return () => {
      cancelled = true;
    };
  }, [houseId, date]);

  if (bookedHouse) {
    return (
      <p className="schedule-lead">
        {firstName}, your tour at {bookedHouse} is requested. We will confirm by phone or email.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setBusy(true);
        setError(null);
        void bookApprovedTour(token, houseId, date, time).then((result) => {
          setBusy(false);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setBookedHouse(result.houseName);
        });
      }}
    >
      <p className="schedule-lead">Pick a house and a time. This link is just for you, {firstName}.</p>
      <div className="field">
        <label htmlFor="eval-house">House</label>
        <select id="eval-house" required value={houseId} onChange={(event) => setHouseId(event.target.value)}>
          <option value="">Select a house</option>
          {houses.map((house) => (
            <option key={house.id} value={house.id}>
              {house.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="eval-date">Tour date</label>
          <input id="eval-date" type="date" required value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="eval-time">Tour time</label>
          <select id="eval-time" required value={time} onChange={(event) => setTime(event.target.value)}>
            <option value="">{slots.length ? "Select a time" : "Select a house and date"}</option>
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
