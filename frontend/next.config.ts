import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
