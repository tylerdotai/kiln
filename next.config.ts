import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["kiln.build", "localhost"],
    },
  },
};

export default nextConfig;
