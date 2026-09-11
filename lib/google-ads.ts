export const GOOGLE_TAG_MANAGER_ID = "GTM-WTFZ6QXB";

/**
 * Google Ads lives entirely in the GTM container (GTM-WTFZ6QXB): the Google tag
 * for AW-18405665580 plus the Contact and Sign-up conversion tags, all triggered
 * by this custom event. Do not fire gtag conversions here as well — that double
 * counts every submission.
 */
export const GTM_FORM_SUBMIT_EVENT = "ncl_form_submit";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Fire after a successful apply, refer, benefits, or tour submit. */
export function trackGoogleAdsContactConversion() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: GTM_FORM_SUBMIT_EVENT });
}
