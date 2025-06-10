import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    domains: ["nehtynmskxttgpyzqcpi.supabase.co"],
  },
};

export default nextConfig;
