import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "جُمْلَتِي — نظام الطلبات",
    short_name: "جُمْلَتِي",
    description: "تطبيق عراقي متكامل للبيع بالجملة والتجزئة والتوصيل.",
    start_url: "/?utm_source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    orientation: "portrait",
    background_color: "#fafafa",
    theme_color: "#2e8b73",
    dir: "rtl",
    lang: "ar",
    categories: ["business", "shopping", "productivity"],
    prefer_related_applications: false,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    shortcuts: [
      {
        name: "طلباتي",
        short_name: "طلباتي",
        description: "تتبّع طلباتك الحالية",
        url: "/retailer/orders",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "المتجر",
        short_name: "المتجر",
        description: "تصفّح تجار الجملة",
        url: "/retailer/shop",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "منتجاتي",
        short_name: "منتجاتي",
        description: "إدارة منتجاتك",
        url: "/wholesale/products",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "السلة",
        short_name: "السلة",
        description: "أكمل طلبك",
        url: "/retailer/cart",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  }
}
