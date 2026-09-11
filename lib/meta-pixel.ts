export const META_PIXEL_ID = "1262055122695836";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type MetaEventParams = {
  content_name?: string;
  content_category?: string;
};

function trackMetaEvent(event: string, params?: MetaEventParams) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}

/** Fire on client-side route changes; the base code covers the first page load. */
export function trackMetaPageView() {
  trackMetaEvent("PageView");
}

/**
 * Apply for residency — Meta SubmitApplication:
 * "When a person applies for a product, service, or program you offer."
 */
export function trackMetaSubmitApplication() {
  trackMetaEvent("SubmitApplication", {
    content_name: "Residency application",
    content_category: "housing",
  });
}

/**
 * Referral or benefits screening — Meta Lead:
 * "A submission of information by a customer with the understanding that
 * they may be contacted at a later date by your business."
 */
export function trackMetaLead(contentName: "Referral" | "Benefits screening") {
  trackMetaEvent("Lead", {
    content_name: contentName,
    content_category: "housing",
  });
}

/**
 * Tour request — Meta Schedule:
 * "The booking of an appointment to visit one of your locations."
 */
export function trackMetaSchedule() {
  trackMetaEvent("Schedule", {
    content_name: "House tour",
    content_category: "housing",
  });
}
