"use server";

import { isValidEmailAddress, sendFreeGuidesEmail } from "@/lib/notify";

export type GuideActionResult = { ok: true } | { ok: false; error: string };

export async function sendFreeGuides(formData: FormData): Promise<GuideActionResult> {
  const email = String(formData.get("email") || "").trim();
  if (!isValidEmailAddress(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  try {
    await sendFreeGuidesEmail(email);
  } catch (error) {
    console.error("Free guide email failed:", error);
    return {
      ok: false,
      error: "We couldn't send the guides just now. Please try again, or call (404) 731-2371.",
    };
  }

  return { ok: true };
}
