"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackGroundTruthPageView } from "@/lib/groundtruth";

export default function GroundTruthPixel() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    trackGroundTruthPageView();
  }, [pathname]);

  return null;
}
