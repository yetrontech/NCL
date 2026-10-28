import { NextResponse } from "next/server";
import { notifyTourEvalDecision } from "@/lib/notify";
import { getSupabase } from "@/lib/supabase";

type EvalRow = {
  id?: string;
  firstName?: string;
  email?: string | null;
  status?: string;
  scheduleToken?: string | null;
};

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
  const id = body.id;
  const status = body.status;
  if (!isUuid(token) || !isUuid(id) || (status !== "accepted" && status !== "denied")) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { data, error } = await getSupabase().rpc("owner_list_tour_evals", { p_token: token });
  if (error) {
    return NextResponse.json({ ok: false, error: "Could not verify owner." }, { status: 401 });
  }
  const payload = data as { ok?: boolean; error?: string; evals?: EvalRow[] } | null;
  if (!payload?.ok) {
    return NextResponse.json({ ok: false, error: payload?.error || "Owner sign-in required." }, { status: 401 });
  }
  const row = (payload.evals ?? []).find((item) => item.id === id);
  if (!row || row.status !== status) {
    return NextResponse.json({ ok: false, error: "That decision is not saved yet." }, { status: 404 });
  }

  try {
    await notifyTourEvalDecision({
      status,
      firstName: row.firstName || "",
      email: row.email,
      scheduleToken: row.scheduleToken,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Tour evaluation email failed:", err);
    const message = err instanceof Error ? err.message : "";
    const safe = message.startsWith("This evaluation") ? message : "Could not send the email.";
    return NextResponse.json({ ok: false, error: safe }, { status: 500 });
  }
}
