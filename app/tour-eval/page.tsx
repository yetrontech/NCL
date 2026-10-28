import type { Metadata } from "next";
import TourEvalWizard from "@/components/onboarding/TourEvalWizard";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { loadSiteContent } from "@/lib/site-content-server";

export const metadata: Metadata = {
  title: "Tour evaluation — New Creation Living",
  description: "Answer a short evaluation. If we approve a tour, we email you a link to pick a time.",
  alternates: { canonical: "/tour-eval" },
};

export const revalidate = 30;

export default async function TourEvalPage() {
  const content = await loadSiteContent();
  const phone = content["footer.contact_phone"] || "(404) 731-2371";

  return (
    <SiteContentProvider content={content}>
      <TourEvalWizard phone={phone} />
    </SiteContentProvider>
  );
}
