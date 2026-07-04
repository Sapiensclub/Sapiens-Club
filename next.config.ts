import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * A stray package-lock.json exists in the user home directory, which makes
   * Next.js guess the wrong workspace root — pin it here explicitly.
   */
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
