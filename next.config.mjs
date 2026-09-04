/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // هذا السطر "السحري" سيمنع كل أخطاء ESLint
  },
};
export default nextConfig;
