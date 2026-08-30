import { NextResponse } from "next/server";
import { notifyApplicantDecision } from "@/lib/notify";
import { getSupabase } from "@/lib/supabase";

type ReviewableTable = "applications" | "referrals";
type ReviewStatus = "accepted" | "denied";

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

function isDecision(value: unknown): value is ReviewStatus {
  return value === "accepted" || value === "denied";
}

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
  const table = body.table;
  const id = body.id;
  const status = body.status;

  if (!isUuid(token) || !isTable(table) || !isUuid(id) || !isDecision(status)) {
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
    await notifyApplicantDecision({ status, table, firstName, email });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Applicant decision email failed:", err);
    return NextResponse.json({ ok: false, error: "Could not send the email." }, { status: 500 });
  }
}
