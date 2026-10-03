import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/retailer/cart",
          "/retailer/settings",
          "/wholesale/settings",
          "/delivery/settings",
          "/invoice/",
          "/orders/",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: siteConfig.url + "/sitemap.xml",
    host: siteConfig.url,
  };
}
