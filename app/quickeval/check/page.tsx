import type { Metadata } from "next";
import QuickEvalWizard from "@/components/onboarding/QuickEvalWizard";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { loadSiteContent } from "@/lib/site-content-server";

export const metadata: Metadata = {
  title: "Quick check questions — New Creation Living",
  description: "Six short questions to see whether New Creation Living may be a fit.",
  alternates: { canonical: "/quickeval/check" },
};

export const revalidate = 30;

export default async function QuickEvalCheckPage() {
  const content = await loadSiteContent();
  const phone = content["footer.contact_phone"] || "(404) 731-2371";

  return (
    <SiteContentProvider content={content}>
      <QuickEvalWizard phone={phone} />
    </SiteContentProvider>
  );
}
