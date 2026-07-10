import type { Metadata } from "next";
import { Cabin_Sketch, Nunito_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HideOnStudio } from "@/components/hide-on-studio";
import { CampaignBanner } from "@/components/campaign-banner";
import { AnalyticsProvider } from "@/components/analytics";
import { getSiteSettings } from "@/sanity/content";
import { getPublishedPostCount } from "@/sanity/blog";
import { site } from "@/lib/site";
import "./globals.css";

/*
 * Fonts (spec §2.2). next/font downloads these at build time and self-hosts
 * them as WOFF2 with `display: swap` — no request to Google at runtime.
 */
const cabinSketch = Cabin_Sketch({
  variable: "--font-cabin-sketch",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sapiens.club"),
  title: "Sapiens — the anti-social-network",
  description:
    "A society where helping each other is the default — not the exception. Real people helping real people nearby: no money, no profiles, no feeds. Launching in India, 2026.",
  alternates: { canonical: "./" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ announcement }, blogPostCount] = await Promise.all([
    getSiteSettings(),
    getPublishedPostCount(),
  ]);
  return (
    <html
      lang="en"
      className={`${cabinSketch.variable} ${nunitoSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* before first paint: apply saved night mode, and mark 'm' when
            motion is allowed (JS present + no reduced-motion preference).
            All scroll/entrance animations key off html.m, so no-JS and
            reduced-motion visitors always get the complete static page. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('sapiens-theme')==='night')document.documentElement.setAttribute('data-mode','night')}catch(e){}" +
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('m');",
          }}
        />
      </head>
      <body className="antialiased">
        <HideOnStudio>
          <a href="#content" className="skip-link">
            Skip to content
          </a>
          {announcement && (
            <div className="bg-spark px-4 py-2 text-center text-sm font-bold text-night">
              {announcement}
            </div>
          )}
          <CampaignBanner />
          <Header showBlog={blogPostCount > 0} />
        </HideOnStudio>
        <main id="content">{children}</main>
        <HideOnStudio>
          <Footer />
        </HideOnStudio>
        <AnalyticsProvider />
        <Analytics />
        {/* Google Analytics 4 (gtag). Handles pageviews across client-side
            navigation automatically. ID via env, with the project's own
            measurement ID as the fallback so it works without extra config. */}
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_ID ?? "G-BG89SQGW2R"}
        />
        {/* JSON-LD: Organization + WebSite (spec §12) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: site.name,
                url: site.url,
                logo: `${site.url}/logo.svg`,
                sameAs: [site.instagramUrl, site.youtubeUrl, site.twitterUrl],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: site.name,
                url: site.url,
              },
            ]),
          }}
        />
      </body>
    </html>
  );
}
