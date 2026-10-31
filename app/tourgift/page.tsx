import type { Metadata } from "next";
import TourGift from "@/components/TourGift";

export const metadata: Metadata = {
  title: "Free tour gift — New Creation Living",
  description:
    "Tour New Creation Living and leave with a $20 MARTA card, a $20 Gift Card for Gas, or a package kit with a tire inflator, car charger, and phone mount.",
  alternates: { canonical: "/tourgift" },
};

export default function TourGiftPage() {
  return <TourGift />;
}
