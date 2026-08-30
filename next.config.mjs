import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
    qualities: [75, 85, 100],
  },
  webpack(
    config,
    {
      dev: dev
    }
  ) {
    if (dev) {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: [/node_modules/],
        use: [{
          loader: '@dhiwise/component-tagger/nextLoader',
        }],
      });
      const ignoredPaths = (process.env.WATCH_IGNORED_PATHS || '')
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      config.watchOptions = {
        ignored: ignoredPaths.length
          ? ignoredPaths.map((p) => `**/${p.replace(/^\/+|\/+$/g, '')}/**`)
          : undefined,
      };
    }
    return config;
  },
};
export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. تمكين ضغط الملفات (Gzip/Brotli) لتقليل حجم الصفحات
  compress: true,

  // 2. تحسين الصور (استخدام WebP/AVIF تلقائياً)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // لاستضافة الصور على Supabase Storage
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // إذا كنت تستخدم صور جوجل
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },


  // 4. منع تحميل المكتبات غير المستخدمة (Tree Shaking)
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'stripe'],
  },
};

export default nextConfig;
