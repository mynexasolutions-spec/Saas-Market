import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/vender",
        destination: "/vendor",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
