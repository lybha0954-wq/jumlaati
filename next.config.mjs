/** @type {import("next").NextConfig} */
const nextConfig = {
  // ═══ الأداء ═══
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // ═══ تقليل حجم الحزم ═══
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@supabase/supabase-js',
      '@supabase/ssr',
      'sonner',
      'date-fns',
      'zod',
    ],
  },

  // ═══ الصور ═══
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // ═══ بيئة التطوير ═══
  allowedDevOrigins: [
    '192.168.1.106',
    '192.168.1.100',
    'localhost',
    '127.0.0.1',
  ],

  // ═══ إعادة التوجيه ═══
  async redirects() {
    return [
      { source: '/admin', destination: '/admin/home', permanent: false },
      { source: '/admin/overview', destination: '/admin/home', permanent: false },
    ];
  },
};

// حذف console.log في الإنتاج فقط
if (process.env.NODE_ENV === 'production') {
  nextConfig.compiler = {
    removeConsole: { exclude: ['error', 'warn'] },
  };
}

export default nextConfig;
