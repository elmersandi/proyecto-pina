/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! Peligro: Le decimos a Next que suba la web aunque haya errores de TS
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignoramos errores de sintaxis al subir
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb", 
    },
    // Forzamos Webpack para evitar el error de GLIBC/Turbopack en el servidor de Hostinger
    turbopack: false,
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