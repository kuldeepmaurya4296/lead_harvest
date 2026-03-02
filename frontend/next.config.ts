import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/stream",
        destination: "http://127.0.0.1:8000/api/stream",
      },
      {
        source: "/api/health",
        destination: "http://127.0.0.1:8000/api/health",
      },
      {
        source: "/api/jobs/:path*",
        destination: "http://127.0.0.1:8000/api/jobs/:path*",
      },
      {
        source: "/api/whatsapp/:path*",
        destination: "http://127.0.0.1:8000/api/whatsapp/:path*",
      },
      {
        source: "/api/download",
        destination: "http://127.0.0.1:8000/api/download",
      },
    ];
  },
};

export default nextConfig;
