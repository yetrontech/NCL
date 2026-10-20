import type { Metadata } from "next";
import MoveOutCalculator from "@/components/MoveOutCalculator";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { loadSiteContent } from "@/lib/site-content-server";

export const metadata: Metadata = {
  title: "Move-Out Calculator — New Creation Living",
  description:
    "See how fast you could save for your own apartment or home while living at New Creation Living for $798 a month, everything included.",
  alternates: { canonical: "/calculate" },
};

export const revalidate = 30;

export default async function CalculatePage() {
  const content = await loadSiteContent();
  const phone = content["footer.contact_phone"] || "(404) 731-2371";

  return (
    <SiteContentProvider content={content}>
      <MoveOutCalculator phone={phone} />
    </SiteContentProvider>
  );
}
