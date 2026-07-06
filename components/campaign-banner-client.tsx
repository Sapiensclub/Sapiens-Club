"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CampaignBanner } from "@/sanity/content";

/*
 * Client half of the campaign banner. Shows only on the homepage, only
 * inside the date window (checked in the browser so cached pages stay
 * correct), and respects dismissal: closing it stores the banner's
 * publish stamp, so it stays hidden until the owner next edits/publishes
 * the banner — then it reappears for everyone.
 */
const DISMISS_KEY = "sapiens-banner-dismissed";

const THEMES = {
  spark: {
    wrap: "bg-spark text-night",
    /* text-[#F7F4EC] (constant light), NOT text-paper — in night mode
       --color-paper flips dark and the button label would vanish */
    cta: "bg-night text-[#F7F4EC] hover:opacity-85",
    dismiss: "text-night/70 hover:text-night",
  },
  indigo: {
    wrap: "bg-night text-moonlight",
    cta: "bg-gold text-night hover:opacity-85",
    dismiss: "text-moonlight/70 hover:text-moonlight",
  },
  paper: {
    wrap: "bg-dawn text-ink border-b-2 border-ink/15",
    cta: "bg-spark text-night hover:opacity-85",
    dismiss: "text-ink/60 hover:text-ink",
  },
} as const;

function Cta({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const external = /^https?:\/\//.test(href);
  const cls = `sketch-border inline-block px-4 py-1.5 text-sm font-bold transition ${className}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function CampaignBannerClient({ banner }: { banner: CampaignBanner }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const now = Date.now();
    if (banner.startDate && now < Date.parse(banner.startDate)) return;
    if (banner.endDate && now > Date.parse(banner.endDate)) return;
    try {
      if (banner.dismissible && localStorage.getItem(DISMISS_KEY) === banner.stamp)
        return;
    } catch {
      /* private browsing — just show it */
    }
    setVisible(true);
  }, [banner]);

  if (pathname !== "/" || !visible) return null;

  const theme = THEMES[banner.theme] ?? THEMES.spark;

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, banner.stamp);
    } catch {
      /* fine — hidden for this visit */
    }
  }

  const dismissButton = banner.dismissible && (
    <button
      type="button"
      onClick={dismiss}
      aria-label="Dismiss banner"
      className={`shrink-0 p-1 ${theme.dismiss}`}
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
        <path
          d="M4 4 C8 8.5 12 12.5 16 16 M16 4 C12 8.5 8 12.5 4 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );

  if (banner.mode === "large") {
    return (
      <section aria-label="Announcement" className={`relative ${theme.wrap}`}>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-12 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col items-start gap-4">
            <h2 className="!text-3xl md:!text-4xl">{banner.headline}</h2>
            {banner.subtext && (
              <p className="max-w-xl text-lg leading-relaxed">{banner.subtext}</p>
            )}
            {banner.ctaLabel && banner.ctaUrl && (
              <Cta href={banner.ctaUrl} className={theme.cta}>
                {banner.ctaLabel}
              </Cta>
            )}
          </div>
          {banner.imageUrl && banner.imageWidth && banner.imageHeight && (
            <Image
              src={banner.imageUrl}
              alt=""
              width={Math.round(banner.imageWidth)}
              height={Math.round(banner.imageHeight)}
              className="max-h-56 w-auto justify-self-center rounded-lg"
            />
          )}
        </div>
        {banner.dismissible && (
          <div className="absolute top-3 right-3">{dismissButton}</div>
        )}
      </section>
    );
  }

  /* bar mode — slim strip */
  return (
    <div aria-label="Announcement" className={theme.wrap}>
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-4 py-2">
        <p className="text-sm font-bold">{banner.headline}</p>
        {banner.ctaLabel && banner.ctaUrl && (
          <Cta href={banner.ctaUrl} className={theme.cta}>
            {banner.ctaLabel}
          </Cta>
        )}
        {dismissButton}
      </div>
    </div>
  );
}
