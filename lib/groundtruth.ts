export const GROUNDTRUTH_GTID = "91ec39bb0fe242f0b7ed1066e660fbb3";

declare global {
  interface Window {
    gtpx?: (...args: unknown[]) => void;
  }
}

export function trackGroundTruthPageView() {
  if (typeof window === "undefined") return;
  if (typeof window.gtpx === "function") {
    window.gtpx("pageview");
  }
}
