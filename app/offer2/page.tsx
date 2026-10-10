import type { Metadata } from "next";
import OfferTwo from "@/components/OfferTwo";
import { loadBedsRemaining } from "@/lib/beds";

export const metadata: Metadata = {
  title: "Stability Speedrun Package — New Creation Living",
  description:
    "Move in free, then pay $125 next month. A no-risk month inside a furnished Atlanta home.",
  alternates: { canonical: "/offer2" },
};

export const dynamic = "force-dynamic";

export default async function OfferTwoPage() {
  const bedsRemaining = await loadBedsRemaining();
  return <OfferTwo bedsRemaining={bedsRemaining} />;
}
