import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'raw.githubusercontent.com',
          port: '',
          pathname: '/PokeAPI/sprites/**',
        },
      ],
      unoptimized: true, // Disable image optimization until usage reset
    },
};

export default nextConfig;
