import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1tn23ah5udsjdadh.public.blob.vercel-storage.com",
        pathname: "/trip-images/**",
      },
    ],
  },
} satisfies NextConfig;

export default nextConfig;
