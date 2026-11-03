import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const KEYS = new Set(["calculate_offer", "offer_fit"]);

export async function POST(request: Request) {
  let key = "";
  try {
    const body = (await request.json()) as { key?: unknown };
    key = typeof body.key === "string" ? body.key : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!KEYS.has(key)) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const { error } = await getSupabaseAdmin().from("site_clicks").insert({ click_key: key });
    if (error) return NextResponse.json({ ok: false }, { status: 500 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
