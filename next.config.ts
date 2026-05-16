import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If deploying to https://caiosobrinho93.github.io/fifa2026/
  // basePath: '/fifa2026',
  // assetPrefix: '/fifa2026',
};

export default nextConfig;
