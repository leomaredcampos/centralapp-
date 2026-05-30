import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "centralapp-27s1.onrender.com",
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://centralapp-27s1.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
