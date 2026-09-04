import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "جُمْلَتِي",
    short_name: "جُمْلَتِي",
    description: "منصة عراقية متكاملة للبيع بالجملة والتجزئة والتوصيل.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#f59e0b",
    dir: "rtl",
    lang: "ar",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
