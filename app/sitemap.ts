import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: "https://www.newcreationliving.org/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://www.newcreationliving.org/apply",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.newcreationliving.org/refer",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://www.newcreationliving.org/resources",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://www.newcreationliving.org/benefits",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://www.newcreationliving.org/privacy",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
