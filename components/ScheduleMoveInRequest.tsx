"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { requestMoveInSlot } from "@/app/schedule/actions";
import { TIME_SLOTS, type BusySlot } from "@/lib/schedule-link";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function easternNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "0";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

function addMonths(yearMonth: string, offset: number) {
  const [year, month] = yearMonth.split("-").map(Number);
  const next = new Date(year, (month || 1) - 1 + offset, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
}

function addDaysKey(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, (month || 1) - 1, (day || 1) + days));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
}

function monthDays(yearMonth: string) {
  const first = `${yearMonth}-01`;
  const startOffset = new Date(`${first}T00:00:00Z`).getUTCDay();
  const start = addDaysKey(first, -startOffset);
  return Array.from({ length: 42 }, (_, i) => addDaysKey(start, i));
}

/** Instant for YYYY-MM-DD HH:mm as America/New_York. */
function easternSlotStart(date: string, time: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  for (const offset of ["-04:00", "-05:00"] as const) {
    const ms = Date.parse(`${date}T${time}:00${offset}`);
    const parts = formatter.formatToParts(new Date(ms));
    const get = (type: string) => parts.find((part) => part.type === type)?.value || "0";
    if (`${get("year")}-${get("month")}-${get("day")}` === date && `${get("hour")}:${get("minute")}` === time) {
      return ms;
    }
  }
  return Date.parse(`${date}T${time}:00-04:00`);
}

function slotConflicts(date: string, time: string, busy: BusySlot[]) {
  const start = easternSlotStart(date, time);
  const end = start + 60 * 60 * 1000;
  return busy.some((item) => Date.parse(item.startsAt) < end && Date.parse(item.endsAt) > start);
}

function slotStillOpen(date: string, time: string, now: { date: string; hour: number; minute: number }) {
  if (date < now.date) return false;
  if (date === now.date) {
    const slotHour = Number(time.slice(0, 2));
    if (slotHour < now.hour) return false;
    if (slotHour === now.hour && now.minute > 0) return false;
  }
  return true;
}

function formatWindowEnd(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatRequested(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function labelTime(slot: string) {
  const [hour, minute] = slot.split(":").map(Number);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ScheduleMoveInRequest({
  token,
  firstName,
  windowEnd,
  requestedMoveInAt,
  busy,
}: {
  token: string;
  firstName: string;
  windowEnd: string;
  requestedMoveInAt: string | null;
  busy: BusySlot[];
}) {
  const now = useMemo(() => easternNow(), []);
  const firstDate = now.hour < 16 ? now.date : addDaysKey(now.date, 1);
  const [month, setMonth] = useState(firstDate.slice(0, 7));
  const [date, setDate] = useState(firstDate);
  const [time, setTime] = useState("10:00");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();
  const days = useMemo(() => monthDays(month), [month]);
  const monthLabel = useMemo(() => {
    const [year, monthNum] = month.split("-").map(Number);
    return new Date(year, (monthNum || 1) - 1, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [month]);

  const availableTimes = useMemo(
    () =>
      TIME_SLOTS.filter(
        (slot) =>
          date >= firstDate && date <= windowEnd && slotStillOpen(date, slot, now) && !slotConflicts(date, slot, busy)
      ),
    [busy, date, firstDate, now, windowEnd]
  );

  useEffect(() => {
    if (availableTimes.length > 0 && !availableTimes.includes(time)) {
      setTime(availableTimes[0]);
    }
  }, [availableTimes, time]);

  if (done) {
    return (
      <div className="onboarding-callout">
        <p>We received your request. Staff will confirm and email you the date.</p>
      </div>
    );
  }

  return (
    <form
      className="schedule-form"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await requestMoveInSlot(token, date, time);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setDone(true);
        });
      }}
    >
      <p className="schedule-lead">
        Hi{firstName ? ` ${firstName}` : ""}, pick a move-in day and time within 35 days
        {windowEnd ? ` (through ${formatWindowEnd(windowEnd)})` : ""}. Staff will confirm this request
        and email you the booked date.
      </p>
      {requestedMoveInAt ? (
        <p className="schedule-current">
          Current request: {formatRequested(requestedMoveInAt)} Eastern. You can pick a different slot
          until staff confirms.
        </p>
      ) : null}

      <div className="schedule-month-nav">
        <button type="button" className="btn btn-ghost" onClick={() => setMonth((value) => addMonths(value, -1))}>
          Previous
        </button>
        <strong>{monthLabel}</strong>
        <button type="button" className="btn btn-ghost" onClick={() => setMonth((value) => addMonths(value, 1))}>
          Next
        </button>
      </div>

      <div className="schedule-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="schedule-month-grid">
        {days.map((key) => {
          const inMonth = key.slice(0, 7) === month;
          const inWindow = key >= firstDate && key <= windowEnd;
          const dayOpen =
            inWindow &&
            TIME_SLOTS.some((slot) => slotStillOpen(key, slot, now) && !slotConflicts(key, slot, busy));
          return (
            <button
              key={key}
              type="button"
              className={[
                "schedule-day",
                !inMonth ? "is-muted" : "",
                key === date ? "is-selected" : "",
                !inWindow || !dayOpen ? "is-blocked" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={!inWindow || !dayOpen}
              onClick={() => setDate(key)}
            >
              {Number(key.slice(8))}
            </button>
          );
        })}
      </div>

      <p className="schedule-time-label">Time (Eastern)</p>
      <div className="schedule-hours">
        {TIME_SLOTS.map((slot) => {
          const open = availableTimes.includes(slot);
          return (
            <button
              key={slot}
              type="button"
              className={["schedule-hour", time === slot ? "is-selected" : ""].filter(Boolean).join(" ")}
              disabled={!open}
              onClick={() => setTime(slot)}
            >
              {labelTime(slot)}
            </button>
          );
        })}
      </div>

      {error ? <p className="schedule-error">{error}</p> : null}

      <div className="onboarding-nav">
        <span />
        <button type="submit" className="btn btn-primary" disabled={isPending || !availableTimes.includes(time)}>
          {isPending ? "Sending…" : "Request this time"}
        </button>
      </div>
    </form>
  );
}
