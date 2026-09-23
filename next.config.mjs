import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
