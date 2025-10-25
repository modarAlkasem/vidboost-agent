import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "i.ytimg.com",
        protocol: "https",
      },
      {
        hostname: "vidboost-dev-media.s3.amazonaws.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
