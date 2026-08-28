export const GOOGLE_ADS_ID = "AW-18405665580";
export const GOOGLE_ADS_CONTACT_SEND_TO = "AW-18405665580/ibyYCOezvugcEKzWwMhE";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire the Google Ads "Contact" conversion after a successful form submit. */
export function trackGoogleAdsContactConversion() {
  if (typeof window === "undefined") return;

  const payload = [
    "event",
    "conversion",
    { send_to: GOOGLE_ADS_CONTACT_SEND_TO },
  ] as const;

  if (typeof window.gtag === "function") {
    window.gtag(...payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push([...payload]);
}
