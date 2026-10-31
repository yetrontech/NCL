import type { Metadata } from "next";
import TourGift from "@/components/TourGift";

export const metadata: Metadata = {
  title: "Choose your tour gift — New Creation Living",
  description:
    "Schedule a tour. At the end, choose a $20 MARTA card, a $20 Gift Card for Gas, or a package kit with a tire inflator, car charger, and phone mount.",
  alternates: { canonical: "/tourgift" },
};

export default function TourGiftPage() {
  return <TourGift />;
}
