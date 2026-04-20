import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5111";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_URL}/api/v1/:path*`,
      },
      {
        source: "/api/chats",
        destination: `${API_URL}/api/chats`,
      },
      {
        source: "/api/chats/:path*",
        destination: `${API_URL}/api/chats/:path*`,
      },
    ];
  },
};

export default nextConfig;
