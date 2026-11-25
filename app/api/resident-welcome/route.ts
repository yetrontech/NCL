import { NextResponse } from "next/server";
import { notifyNewResident } from "@/lib/notify";
import { getSupabase } from "@/lib/supabase";

function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const firstName = typeof body.firstName === "string" ? body.firstName.trim().slice(0, 40) : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";
  const setupCode = typeof body.setupCode === "string" ? body.setupCode.trim() : "";

  if (!isUuid(token) || !firstName || !email) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (pin && !/^[0-9]{4}$/.test(pin)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (setupCode && !/^[0-9]{6}$/.test(setupCode)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { data, error } = await getSupabase().rpc("house_list_houses", { p_token: token });
  const listed = data as { ok?: boolean; error?: string } | null;
  if (error || !listed?.ok) {
    return NextResponse.json(
      { ok: false, error: listed?.error || "Staff sign-in required." },
      { status: 401 }
    );
  }

  try {
    await notifyNewResident({
      firstName,
      email,
      pin: pin || null,
      setupCode: setupCode || null,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resident welcome email failed:", err);
    const message = err instanceof Error ? err.message : "";
    const safe =
      message.startsWith("Email is not set up") ||
      message.startsWith("Gmail backup") ||
      message.startsWith("This resident")
        ? message
        : "Could not send the welcome email.";
    return NextResponse.json({ ok: false, error: safe }, { status: 500 });
  }
}
