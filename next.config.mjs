/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["kiln.build", "localhost"],
    },
  },
};

export default nextConfig;
