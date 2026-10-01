import type { Metadata } from "next";
import ApplyWizard from "@/components/onboarding/ApplyWizard";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { loadSiteContent } from "@/lib/site-content-server";

export const metadata: Metadata = {
  title: "Apply for Residency — New Creation Living",
  description: "Apply for structured independent living at New Creation Living.",
};

export const revalidate = 30;

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ promo?: string | string[] }>;
}) {
  const params = await searchParams;
  const promo = Array.isArray(params.promo) ? params.promo[0] : params.promo;
  const content = await loadSiteContent();
  return (
    <SiteContentProvider content={content}>
      <ApplyWizard promoCode={promo} />
    </SiteContentProvider>
  );
}
