import type { Metadata } from "next";
import OfferTwo from "@/components/OfferTwo";
import { loadBedsRemaining } from "@/lib/beds";

export const metadata: Metadata = {
  title: "Stability Speedrun Package — New Creation Living",
  description:
    "Move in today for $1. Rent starts the 1st of next month at $798, no matter which day you move in.",
  alternates: { canonical: "/offer2" },
};

export const dynamic = "force-dynamic";

export default async function OfferTwoPage() {
  const bedsRemaining = await loadBedsRemaining();
  return <OfferTwo bedsRemaining={bedsRemaining} />;
}
