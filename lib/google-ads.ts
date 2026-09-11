export const GOOGLE_ADS_ID = "AW-18405665580";
export const GOOGLE_TAG_MANAGER_ID = "GTM-WTFZ6QXB";
export const GOOGLE_ADS_CONTACT_SEND_TO = "AW-18405665580/ibyYCOezvugcEKzWwMhE";
export const GOOGLE_ADS_SIGNUP_SEND_TO = "AW-18405665580/B5ajCMqt5_IcEKzWwMhE";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function trackGoogleAdsConversion(sendTo: string) {
  if (typeof window === "undefined") return;

  const payload = ["event", "conversion", { send_to: sendTo }] as const;

  if (typeof window.gtag === "function") {
    window.gtag(...payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push([...payload]);
}

/** Fire Google Ads conversions after a successful apply, refer, benefits, or tour submit. */
export function trackGoogleAdsContactConversion() {
  trackGoogleAdsConversion(GOOGLE_ADS_CONTACT_SEND_TO);
  trackGoogleAdsConversion(GOOGLE_ADS_SIGNUP_SEND_TO);
}
