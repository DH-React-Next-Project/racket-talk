import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yeyak.seoul.go.kr",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;