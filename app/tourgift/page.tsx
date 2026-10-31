import type { Metadata } from "next";
import TourGift from "@/components/TourGift";

export const metadata: Metadata = {
  title: "Choose your tour gift — New Creation Living",
  description:
    "Schedule a tour. At the end, choose a $20 MARTA card, a gas card, or a tire inflator with a car charger and phone mount.",
  alternates: { canonical: "/tourgift" },
};

export default function TourGiftPage() {
  return <TourGift />;
}
