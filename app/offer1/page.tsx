import type { Metadata } from "next";
import GuideSignup from "@/components/GuideSignup";
import { loadBedsRemaining } from "@/lib/beds";

export const metadata: Metadata = {
  title: "Free guides — New Creation Living",
  description:
    "A daily plan, an honest housing comparison, and what a fixed income actually covers in metro Atlanta.",
  alternates: { canonical: "/offer1" },
};

export const dynamic = "force-dynamic";

export default async function OfferOnePage() {
  const bedsRemaining = await loadBedsRemaining();
  return <GuideSignup bedsRemaining={bedsRemaining} />;
}
