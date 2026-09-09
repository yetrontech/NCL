import { NextResponse } from "next/server";
import { notifyMoveInDate } from "@/lib/notify";
import { getSupabase } from "@/lib/supabase";

type ReviewableTable = "applications" | "referrals";

type InboxRow = {
  id?: string;
  first_name?: string;
  email?: string | null;
  referee_first_name?: string;
  referee_email?: string | null;
};

type InboxRpc = {
  ok?: boolean;
  error?: string;
  applications?: InboxRow[];
  referrals?: InboxRow[];
};

function isTable(value: unknown): value is ReviewableTable {
  return value === "applications" || value === "referrals";
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isTime(value: unknown): value is string {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const table = body.table;
  const id = body.id;
  const date = body.date;
  const time = body.time;

  if (!isUuid(token) || !isTable(table) || !isUuid(id) || !isDate(date) || !isTime(time)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { data, error } = await getSupabase().rpc("owner_inbox", { p_token: token });
  if (error) {
    return NextResponse.json({ ok: false, error: "Could not verify owner." }, { status: 401 });
  }

  const inbox = data as InboxRpc | null;
  if (!inbox?.ok) {
    return NextResponse.json(
      { ok: false, error: inbox?.error || "Owner sign-in required." },
      { status: 401 }
    );
  }

  const rows = table === "applications" ? inbox.applications : inbox.referrals;
  const row = Array.isArray(rows) ? rows.find((item) => item.id === id) : undefined;
  if (!row) {
    return NextResponse.json({ ok: false, error: "Submission not found." }, { status: 404 });
  }

  const firstName =
    table === "applications" ? row.first_name || "" : row.referee_first_name || "";
  const email = table === "applications" ? row.email : row.referee_email;

  try {
    await notifyMoveInDate({ firstName, email, date, time });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Move-in date email failed:", err);
    const message = err instanceof Error ? err.message : "";
    const safe =
      message.startsWith("Email is not set up") ||
      message.startsWith("Gmail backup") ||
      message.startsWith("This application has no") ||
      message.startsWith("This application does not")
        ? message
        : "Could not send the email.";
    return NextResponse.json({ ok: false, error: safe }, { status: 500 });
  }
}
