import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['impit'],
  },
};

export default nextConfig;
