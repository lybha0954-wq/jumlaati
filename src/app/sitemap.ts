import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://jumlaati.netlify.app', lastModified: new Date() },
    { url: 'https://jumlaati.netlify.app/products', lastModified: new Date() },
    { url: 'https://jumlaati.netlify.app/login', lastModified: new Date() },
  ]
}
