export const FREE_GUIDES = [
  {
    filename: "NCL-Daily-Structure-Guide.pdf",
    title: "Here's What to Do Each Day on a Fixed Income",
    button: "Download the daily guide",
  },
  {
    filename: "NCL-Housing-Options-Compared.pdf",
    title: "Here's Your Honest Housing Options Comparison",
    button: "Download the housing comparison",
  },
  {
    filename: "NCL-Fixed-Income-Checklist.pdf",
    title: "Here's What Fixed Income Actually Covers in Atlanta",
    button: "Download the cost guide",
  },
] as const;

export function freeGuideHref(filename: string): string {
  return `/guides/${filename}`;
}
