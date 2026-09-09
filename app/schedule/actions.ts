"use server";

import { submitMoveInRequest } from "@/lib/schedule-link";

export async function requestMoveInSlot(
  token: string,
  date: string,
  time: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return { ok: false, error: "Pick a move-in date and time." };
  }
  return submitMoveInRequest(token, date, time);
}
