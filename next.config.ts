import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.habbo.com' },
      { protocol: 'https', hostname: 'www.habbo.com' },
      { protocol: 'https', hostname: 'www.habbo.com.tr' },
      { protocol: 'https', hostname: 'habbo.com.tr' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
};

export default nextConfig;
