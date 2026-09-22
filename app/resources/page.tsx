import type { Metadata } from "next";
import ResourceGuidePage from "@/components/pages/ResourceGuidePage";
import { loadSiteContent } from "@/lib/site-content-server";

export const metadata: Metadata = {
  title: "Resident Resource Guide — New Creation Living",
  description:
    "Metro Atlanta AA/NA meetings, free volunteer shifts, and low-cost GED, CNA, and trade programs for New Creation Living residents.",
  alternates: { canonical: "/resources" },
};

export const revalidate = 30;

export default async function ResourcesPage() {
  const content = await loadSiteContent();
  const tagline = content["brand.tagline"] || "From Benefits to Belonging";
  const phone = content["footer.contact_phone"] || "(404) 731-2371";

  return <ResourceGuidePage tagline={tagline} phone={phone} />;
}
