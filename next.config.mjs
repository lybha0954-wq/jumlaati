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
};

export default nextConfig;
