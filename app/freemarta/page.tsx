import type { Metadata } from "next";
import FreeMarta from "@/components/FreeMarta";

export const metadata: Metadata = {
  title: "Free $20 MARTA Card — New Creation Living",
  description:
    "Get a $20 MARTA card when you tour New Creation Living. See all-inclusive housing and decide if it is the right fit.",
  alternates: { canonical: "/freemarta" },
};

export default function FreeMartaPage() {
  return <FreeMarta />;
}
