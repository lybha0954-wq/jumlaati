import type { Metadata } from "next";
import { siteConfig } from "./site";

export const baseMetadata: Metadata = {
  title: {
    default: siteConfig.name + " — نظام الطلبات للجملة والتوصيل",
    template: "%s | " + siteConfig.name,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "جملتي", "جُمْلَتِي", "جملة", "تجزئة", "توصيل",
    "العراق", "كربلاء", "بغداد", "سوبرماركت", "تاجر جملة",
    "طلبات جملة", "B2B", "منصة تجارية",
  ],
  authors: [{ name: "Jumlati Team" }],
  creator: "Jumlati",
  publisher: "Jumlati",
  applicationName: "جُمْلَتِي",
  category: "business",
  classification: "B2B Platform",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "ar_IQ",
    url: siteConfig.url,
    title: siteConfig.name + " — نظام الطلبات للجملة والتوصيل",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/icons/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
