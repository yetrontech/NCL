import { NextResponse } from "next/server";
import { loadBedsRemaining } from "@/lib/beds";

export const dynamic = "force-dynamic";

export async function GET() {
  const remaining = await loadBedsRemaining();
  return NextResponse.json(
    { remaining },
    { headers: { "Cache-Control": "no-store" } }
  );
}
