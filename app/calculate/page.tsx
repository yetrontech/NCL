import type { Metadata } from "next";
import MoveOutCalculator from "@/components/MoveOutCalculator";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { loadSiteContent } from "@/lib/site-content-server";

export const metadata: Metadata = {
  title: "What if your current income could take you further? — New Creation Living",
  description:
    "Pick a goal for the next 1 to 5 years. Compare a regular timeline with an NCL fast-track, and export the calendars.",
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
