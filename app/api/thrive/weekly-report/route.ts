import { NextResponse } from "next/server";

import { sendThriveWeeklyReport } from "@/lib/notify";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type Report = {
  ok?: boolean;
  error?: string;
  alreadySent?: boolean;
  weekStart?: string;
  weekEnd?: string;
  residents?: number;
  setupReady?: number;
  setupDone?: number;
  day7Done?: number;
  day30Ready?: number;
  day30Done?: number;
  activeDone?: number;
  pointsPaid?: number;
};

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function count(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function rate(label: string, done: number, ready: number, goal: string) {
  if (ready <= 0) return `${label}: no one has been here long enough yet.`;
  const pct = Math.round((done / ready) * 100);
  return `${label}: ${done} of ${ready} (${pct}%). ${goal}`;
}

function formatDay(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function reportText(report: Report) {
  const residents = count(report.residents);
  const start = report.weekStart || "";
  const end = report.weekEnd || "";
  return [
    `Thrive for the week of ${formatDay(start)}–${formatDay(end)}.`,
    `${residents} resident${residents === 1 ? "" : "s"} with a move-in date.`,
    rate(
      "Finished setup in week 1",
      count(report.setupDone),
      count(report.setupReady),
      "Goal: most new residents."
    ),
    rate(
      "Still checking in at day 7",
      count(report.day7Done),
      count(report.setupReady),
      "Checked in on or after their 7th day."
    ),
    rate(
      "Still checking in at day 30",
      count(report.day30Done),
      count(report.day30Ready),
      "Goal: 50%."
    ),
    rate(
      "Active this week",
      count(report.activeDone),
      residents,
      "Goal: 60%. A check-in or a Thrive action in the last 7 days."
    ),
    `Thrive points paid this week: ${count(report.pointsPaid)}.`,
    "This note has totals only. It does not include anyone’s money, debt, or benefits.",
  ].join("\n");
}

async function sendReport() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("thrive_weekly_report");
  const report = data as Report | null;
  if (error || !report?.ok || !report.weekStart) {
    return NextResponse.json(
      { ok: false, error: report?.error || error?.message || "Could not build the Thrive report." },
      { status: 500 }
    );
  }
  if (report.alreadySent) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  await sendThriveWeeklyReport(reportText(report));

  const marked = await supabase.rpc("thrive_mark_weekly_report", { p_week: report.weekStart });
  if (marked.error) {
    return NextResponse.json(
      { ok: false, error: "The email went out, but this week was not marked as sent." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, sent: true });
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 401 });
  }
  try {
    return await sendReport();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send the Thrive report.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
