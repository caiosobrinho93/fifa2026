import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Set the base path to the repository name for GitHub Pages
  basePath: '/fifa2026',
  assetPrefix: '/fifa2026',
};

export default nextConfig;
