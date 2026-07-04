import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * A stray package-lock.json exists in the user home directory, which makes
   * Next.js guess the wrong workspace root — pin it here explicitly.
   */
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
