/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: { remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }] },
  allowedDevOrigins: [
    "192.168.1.100",
    "192.168.1.100:3000",
    "localhost",
    "localhost:3000",
  ],
  // Cache buster: 2026-09-13
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
