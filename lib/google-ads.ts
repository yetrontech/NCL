export const GOOGLE_ADS_ID = "AW-18405665580";
export const GOOGLE_TAG_MANAGER_ID = "GTM-WTFZ6QXB";
export const GOOGLE_ADS_CONTACT_SEND_TO = "AW-18405665580/ibyYCOezvugcEKzWwMhE";
export const GOOGLE_ADS_SIGNUP_SEND_TO = "AW-18405665580/B5ajCMqt5_IcEKzWwMhE";
export const GTM_FORM_SUBMIT_EVENT = "ncl_form_submit";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function trackGoogleAdsConversion(sendTo: string) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", { send_to: sendTo });
  }
}

/** Fire after a successful apply, refer, benefits, or tour submit. */
export function trackGoogleAdsContactConversion() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: GTM_FORM_SUBMIT_EVENT });
  trackGoogleAdsConversion(GOOGLE_ADS_CONTACT_SEND_TO);
  trackGoogleAdsConversion(GOOGLE_ADS_SIGNUP_SEND_TO);
}
