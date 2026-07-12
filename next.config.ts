import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://**.example.com/**")],
    qualities: [25, 50, 75, 100],
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
