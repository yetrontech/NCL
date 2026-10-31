import type { Metadata } from "next";
import TourGift from "@/components/TourGift";

export const metadata: Metadata = {
  title: "Free $20 Gas Card or Package Kit — New Creation Living",
  description:
    "Get a $20 Gift Card for Gas or a package kit when you tour New Creation Living. See all-inclusive housing and decide if it is the right fit.",
  alternates: { canonical: "/tourgift" },
};

export default function TourGiftPage() {
  return <TourGift />;
}
