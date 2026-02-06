import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  // ✅ อยู่ระดับบนสุดแล้ว (ไม่ใช่ experimental)
  serverExternalPackages: ["impit"],
};

export default nextConfig;
