"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import VideoModal from "@/components/VideoModal";
import LocationGalleryModal from "@/components/LocationGalleryModal";
import type { LocationGalleryId } from "@/lib/location-galleries";
import HomePage from "@/components/pages/HomePage";
import AboutPage from "@/components/pages/AboutPage";
import LifePage from "@/components/pages/LifePage";
import ReferralPage from "@/components/pages/ReferralPage";
import BenefitsPage from "@/components/pages/BenefitsPage";
import LocationsPage from "@/components/pages/LocationsPage";
import FaqPage from "@/components/pages/FaqPage";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import type { SiteContentMap } from "@/lib/site-content";

export default function SiteApp({ content }: { content: SiteContentMap }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [galleryId, setGalleryId] = useState<LocationGalleryId | null>(null);

  return (
    <SiteContentProvider content={content}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Header />

      <main id="main">
        <HomePage />
        <AboutPage />
        <LifePage />
        <ReferralPage />
        <BenefitsPage />
        <LocationsPage
          onWatchVideo={() => setVideoOpen(true)}
          onOpenGallery={setGalleryId}
        />
        <FaqPage />
      </main>

      <Footer />

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
      <LocationGalleryModal galleryId={galleryId} onClose={() => setGalleryId(null)} />

      <BackToTop />
    </SiteContentProvider>
  );
}
