/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: process.env.NEXT_PUBLIC_CONVEX_URL.replace('https://', '') }],
  },
  experimental: {
    instrumentationHook: true
  }
};

export default nextConfig;
