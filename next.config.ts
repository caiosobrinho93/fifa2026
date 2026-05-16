import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/fifa2026',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
