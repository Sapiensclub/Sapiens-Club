"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type posthogType from "posthog-js";

/*
 * Analytics (spec §12). PostHog loads lazily and ONLY if
 * NEXT_PUBLIC_POSTHOG_KEY is set — without it every capture is a silent
 * no-op, so the site never breaks over analytics.
 *
 * Events: waitlist_signup {city, source} (fired from waitlist-form) ·
 * volunteer_click (any element with data-analytics="volunteer_click") ·
 * journey_completed (fired from celestial/journey) ·
 * scroll_depth {25,50,75,100} · shop_tease_view.
 */
let posthog: typeof posthogType | null = null;

export function capture(event: string, props?: Record<string, unknown>) {
  try {
    posthog?.capture(event, props);
  } catch {
    /* analytics must never break the site */
  }
}

export function AnalyticsProvider() {
  const pathname = usePathname();

  /* init PostHog once, only with a key */
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog) return;
    import("posthog-js").then(({ default: ph }) => {
      ph.init(key, {
        /* if the PostHog project is EU-hosted, set
           NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com */
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
        capture_pageview: true,
        capture_pageleave: true,
      });
      posthog = ph;
    });
  }, []);

  /* scroll depth per page: 25 / 50 / 75 / 100 */
  useEffect(() => {
    const fired = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const depth =
        ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
      for (const t of [25, 50, 75, 100]) {
        if (depth >= t && !fired.has(t)) {
          fired.add(t);
          capture("scroll_depth", { depth: t, path: pathname });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  /* delegated clicks: any element with data-analytics="<event>" */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-analytics]"
      );
      if (el?.dataset.analytics) {
        capture(el.dataset.analytics, {
          href: (el as HTMLAnchorElement).href,
          path: pathname,
        });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  /* shop tease view */
  useEffect(() => {
    if (pathname === "/shop") capture("shop_tease_view");
  }, [pathname]);

  return null;
}
