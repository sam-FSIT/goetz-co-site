import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permettre les images depuis le dossier public/uploads
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
