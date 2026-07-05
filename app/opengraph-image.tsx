import { ImageResponse } from "next/og";
import { SOLE, TOES, LOGO_VIEWBOX } from "@/components/logo-paths";

/*
 * OG image (spec §12): 1200×630 — paper background, footprint-S, the
 * vision line in Cabin Sketch, spark accents. Rendered once at build.
 */
export const alt =
  "Sapiens — a society where helping each other is the default, not the exception.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function cabinSketch(): Promise<ArrayBuffer | null> {
  try {
    /* old-UA trick makes Google Fonts return TTF (satori can't read woff2) */
    const css = await (
      await fetch(
        "https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@700",
        { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" } }
      )
    ).text();
    const url = css.match(/src: url\((.+?)\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const font = await cabinSketch();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#F7F4EC",
          color: "#141414",
          padding: "64px 72px",
          fontFamily: font ? "Cabin Sketch" : "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            width: 760,
          }}
        >
          <div style={{ fontSize: 58, lineHeight: 1.15, display: "flex" }}>
            A society where helping each other is the default — not the
            exception.
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#F59E2D",
              display: "flex",
            }}
          >
            sapiens.club · Launching in India, 2026
          </div>
        </div>
        <svg
          viewBox={LOGO_VIEWBOX}
          width={300}
          height={512}
          style={{ marginLeft: 40 }}
        >
          {[...SOLE, ...TOES].map((d, i) => (
            <path key={i} d={d} fill="#141414" />
          ))}
        </svg>
        {/* spark sparkle accents */}
        <svg
          viewBox="0 0 48 48"
          width={64}
          height={64}
          style={{ position: "absolute", top: 48, right: 96 }}
        >
          <path
            d="M24 4 C25 14 28 20 40 24 C28 28 25 34 24 44 C23 34 20 28 8 24 C20 20 23 14 24 4 Z"
            fill="#F59E2D"
          />
        </svg>
        <svg
          viewBox="0 0 48 48"
          width={36}
          height={36}
          style={{ position: "absolute", bottom: 72, right: 420 }}
        >
          <path
            d="M24 4 C25 14 28 20 40 24 C28 28 25 34 24 44 C23 34 20 28 8 24 C20 20 23 14 24 4 Z"
            fill="#F0C078"
          />
        </svg>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Cabin Sketch", data: font, weight: 700 as const }]
        : undefined,
    }
  );
}
