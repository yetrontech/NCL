import type { Metadata } from "next";
import OfferOne from "@/components/OfferOne";
import { loadBedsRemaining } from "@/lib/beds";
import { loadSiteContent } from "@/lib/site-content-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadSiteContent();
  return {
    title: content["offer1.seo_title"] || "Limited space offer — New Creation Living",
    description:
      content["offer1.seo_description"] ||
      "Bring your friends and pay $125 in rent. The month you move in is free, with a 100% refund within 7 days.",
    alternates: { canonical: "/offer1" },
  };
}

export default async function OfferOnePage() {
  const [content, bedsRemaining] = await Promise.all([loadSiteContent(), loadBedsRemaining()]);
  return <OfferOne content={content} bedsRemaining={bedsRemaining} />;
}
