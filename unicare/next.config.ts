import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5111";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
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
        source: "/api/Categories",
        destination: `${API_URL}/api/Categories`,
      },
      {
        source: "/api/Categories/:path*",
        destination: `${API_URL}/api/Categories/:path*`,
      },
      {
        source: "/api/transactions",
        destination: `${API_URL}/api/transactions`,
      },
      {
        source: "/api/transactions/:path*",
        destination: `${API_URL}/api/transactions/:path*`,
      },
      {
        source: "/api/chats",
        destination: `${API_URL}/api/chats`,
      },
      {
        source: "/api/chats/:path*",
        destination: `${API_URL}/api/chats/:path*`,
      },
      {
        source: "/hubs/chat",
        destination: `${API_URL}/hubs/chat`,
      },
      {
        source: "/hubs/chat/:path*",
        destination: `${API_URL}/hubs/chat/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
