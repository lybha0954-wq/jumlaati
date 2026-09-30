/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
  allowedDevOrigins: [
    "192.168.1.106",
    "192.168.1.100",
    "localhost",
    "127.0.0.1",
  ],
  async redirects() {
    return [
      { source: "/admin", destination: "/admin/home", permanent: false },
      { source: "/admin/overview", destination: "/admin/home", permanent: false },
    ];
  },
};

export default nextConfig;
