import { createClient } from "@supabase/supabase-js";

export const SCHEDULE_PHONE = "(404) 731-2371";
export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export type BusySlot = {
  kind: string;
  startsAt: string;
  endsAt: string;
};

export type ScheduleLinkOpen = {
  open: true;
  firstName: string;
  windowEnd: string;
  requestedMoveInAt: string | null;
  busy: BusySlot[];
};

export type ScheduleLinkClosed = {
  open: false;
};

export type ScheduleLinkInfo = ScheduleLinkOpen | ScheduleLinkClosed;

const TOKEN_RE = /^[a-f0-9]{32,64}$/i;

export function isScheduleToken(value: string) {
  return TOKEN_RE.test(value.trim());
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured.");
  }
  return createClient(url, anonKey);
}

function asBusy(value: unknown): BusySlot[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as { kind?: string; startsAt?: string; endsAt?: string };
      if (!row?.startsAt || !row?.endsAt) return null;
      return { kind: row.kind || "busy", startsAt: row.startsAt, endsAt: row.endsAt };
    })
    .filter((item): item is BusySlot => Boolean(item));
}

export async function loadScheduleLink(token: string): Promise<ScheduleLinkInfo> {
  if (!isScheduleToken(token)) return { open: false };
  try {
    const { data, error } = await client().rpc("public_schedule_link_info", {
      p_token: token.trim().toLowerCase(),
    });
    if (error) {
      console.error("Schedule link info failed:", error.message);
      return { open: false };
    }
    const row = data as {
      ok?: boolean;
      open?: boolean;
      firstName?: string;
      windowEnd?: string;
      requestedMoveInAt?: string | null;
      busy?: unknown;
    } | null;
    if (!row?.ok || !row.open || !row.windowEnd) return { open: false };
    return {
      open: true,
      firstName: row.firstName || "",
      windowEnd: String(row.windowEnd).slice(0, 10),
      requestedMoveInAt: row.requestedMoveInAt || null,
      busy: asBusy(row.busy),
    };
  } catch (err) {
    console.error("Schedule link info failed:", err);
    return { open: false };
  }
}

export async function submitMoveInRequest(
  token: string,
  date: string,
  time: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isScheduleToken(token)) {
    return { ok: false, error: "This link is no longer open." };
  }
  try {
    const { data, error } = await client().rpc("public_request_move_in", {
      p_token: token.trim().toLowerCase(),
      p_date: date,
      p_time: time,
    });
    if (error) {
      const missing =
        error.message.includes("public_request_move_in") || error.message.includes("schema cache");
      return {
        ok: false,
        error: missing
          ? "This link is no longer open."
          : error.message || "Could not save your request.",
      };
    }
    const row = data as { ok?: boolean; error?: string } | null;
    if (!row?.ok) {
      return { ok: false, error: row?.error || "Could not save your request." };
    }
    return { ok: true };
  } catch (err) {
    console.error("Move-in request failed:", err);
    return { ok: false, error: "Could not save your request." };
  }
}
