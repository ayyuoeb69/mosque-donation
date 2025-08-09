import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ⚠️ Warning: This ignores ALL ESLint errors during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
