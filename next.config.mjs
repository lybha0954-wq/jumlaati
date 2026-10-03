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

  // ═══ Security Headers ═══
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://*.supabase.co https://api.qrserver.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.qrserver.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/icons/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
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
