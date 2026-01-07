import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com", // <--- On ajoute cette ligne
      },
      {
        protocol: "https",
        // C'est le domaine exact de ton projet Supabase (celui qui est dans l'erreur)
        hostname: "qbxqvcaxaheylylqojip.supabase.co",
      },
    ],
  },
};

export default nextConfig;
