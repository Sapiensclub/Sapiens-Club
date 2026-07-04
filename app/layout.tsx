import type { Metadata } from "next";
import { Cabin_Sketch, Nunito_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HideOnStudio } from "@/components/hide-on-studio";
import { CampaignBanner } from "@/components/campaign-banner";
import { getSiteSettings } from "@/sanity/content";
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { announcement } = await getSiteSettings();
  return (
    <html
      lang="en"
      className={`${cabinSketch.variable} ${nunitoSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* apply saved night mode before first paint — prevents a light flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('sapiens-theme')==='night')document.documentElement.setAttribute('data-mode','night')}catch(e){}",
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
          <Header />
        </HideOnStudio>
        <main id="content">{children}</main>
        <HideOnStudio>
          <Footer />
        </HideOnStudio>
      </body>
    </html>
  );
}
