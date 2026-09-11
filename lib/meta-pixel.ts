export const META_PIXEL_ID = "1262055122695836";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function trackMetaEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}

/** Fire on client-side route changes; the base code covers the first page load. */
export function trackMetaPageView() {
  trackMetaEvent("PageView");
}

/** Fire after a successful apply, refer, benefits, or tour submit. */
export function trackMetaLead() {
  trackMetaEvent("Lead");
}
