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
  /*
   * Security headers (QA/security pass). HSTS is already added by Vercel.
   * /studio is excluded from frame-blocking because Sanity's studio uses
   * iframes internally.
   */
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];
    return [
      {
        source: "/((?!studio).*)",
        headers: [...base, { key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
      { source: "/studio/:path*", headers: base },
    ];
  },
};

export default nextConfig;
