import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "جُمْلَتِي — نظام الطلبات",
    short_name: "جُمْلَتِي",
    description: "تطبيق عراقي متكامل للبيع بالجملة والتجزئة والتوصيل.",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fafafa",
    theme_color: "#2e8b73",
    dir: "rtl",
    lang: "ar",
    categories: ["business", "shopping", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    shortcuts: [
      { name: "طلباتي", url: "/retailer/orders" },
      { name: "المتجر", url: "/retailer/shop" },
      { name: "منتجاتي", url: "/wholesale/products" },
    ],
  }
}
