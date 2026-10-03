import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const publicPages = [
    { url: "/", changeFrequency: "daily" as const, priority: 1.0 },
    { url: "/products", changeFrequency: "hourly" as const, priority: 0.9 },
    { url: "/offers", changeFrequency: "daily" as const, priority: 0.8 },
    { url: "/pricing", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: "/about", changeFrequency: "monthly" as const, priority: 0.5 },
    { url: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
    { url: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { url: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
    { url: "/refund-policy", changeFrequency: "yearly" as const, priority: 0.3 },
    { url: "/login", changeFrequency: "monthly" as const, priority: 0.4 },
    { url: "/register", changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  return publicPages.map((page) => ({
    url: baseUrl + page.url,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
