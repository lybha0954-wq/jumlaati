/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
  allowedDevOrigins: [
    "192.168.1.100",
    "192.168.1.100:3000",
    "localhost",
    "localhost:3000",
  ],
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/home",
        permanent: false,
      },
      {
        source: "/admin/overview",
        destination: "/admin/home",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
