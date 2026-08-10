// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb", // Límite ampliado para PDFs pesados
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lseaoldllobatjpnzpdx.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;