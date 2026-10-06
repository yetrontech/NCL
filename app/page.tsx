import SiteApp from "@/components/SiteApp";
import { loadBedsRemaining } from "@/lib/beds";
import { loadSiteContent } from "@/lib/site-content-server";

export const revalidate = 30;

export default async function Page() {
  const [content, bedsRemaining] = await Promise.all([
    loadSiteContent(),
    loadBedsRemaining(),
  ]);
  return <SiteApp content={content} bedsRemaining={bedsRemaining} />;
}
