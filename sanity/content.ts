import { groq } from "next-sanity";
import { client, projectId } from "./client";
import { site } from "@/lib/site";

/*
 * Content getters (spec §9): every read is tagged 'content' so the
 * /api/revalidate webhook can refresh the whole site the moment the owner
 * hits Publish in the studio; revalidate 3600 is the safety-net fallback.
 *
 * Every getter degrades gracefully: CMS empty or unreachable → the
 * hardcoded spec copy still renders. The site can never be blank.
 */
const FETCH_OPTS = { next: { tags: ["content"], revalidate: 3600 } };

async function cmsFetch<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {}
): Promise<T> {
  if (!projectId) return fallback;
  try {
    const data = await client.fetch<T>(query, params, FETCH_OPTS);
    return data ?? fallback;
  } catch (err) {
    console.error("[cms] fetch failed, using fallback copy:", err);
    return fallback;
  }
}

/* ---- site settings (merged over lib/site defaults) ---- */

export type SiteSettings = typeof site & { announcement?: string };

export async function getSiteSettings(): Promise<SiteSettings> {
  const cms = await cmsFetch<Partial<SiteSettings> | null>(
    groq`*[_type == "siteSettings"][0]{
      taglineVision, taglineHook, launchLine, contactEmail, volunteerFormUrl,
      instagramUrl, youtubeUrl, twitterUrl, marqueeItems, cities, announcement
    }`,
    null
  );
  // CMS wins field-by-field; anything unset falls back to lib/site
  const merged = { ...site } as SiteSettings;
  if (cms) {
    for (const [k, v] of Object.entries(cms)) {
      if (v !== null && v !== undefined && v !== "" && k in merged === true) {
        // arrays must be non-empty to override
        if (Array.isArray(v) && v.length === 0) continue;
        (merged as Record<string, unknown>)[k] = v;
      } else if (k === "announcement" && v) {
        merged.announcement = v as string;
      }
    }
    if (cms.announcement) merged.announcement = cms.announcement;
  }
  return merged;
}

/* ---- campaign banner (homepage top) ---- */

export type CampaignBanner = {
  enabled: boolean;
  mode: "bar" | "large";
  headline: string;
  subtext?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  ctaLabel?: string;
  ctaUrl?: string;
  theme: "spark" | "indigo" | "paper";
  dismissible: boolean;
  startDate?: string;
  endDate?: string;
  /* changes on every publish — used to re-show after edits despite dismissal */
  stamp: string;
};

export async function getCampaignBanner(): Promise<CampaignBanner | null> {
  return cmsFetch<CampaignBanner | null>(
    groq`*[_type == "campaignBanner"][0]{
      enabled, mode, headline, subtext,
      "imageUrl": image.asset->url,
      "imageWidth": image.asset->metadata.dimensions.width,
      "imageHeight": image.asset->metadata.dimensions.height,
      ctaLabel, ctaUrl, theme, dismissible, startDate, endDate,
      "stamp": _updatedAt
    }`,
    null
  );
}

/* ---- minimal hero (top of homepage) ---- */

export type MinimalHero = {
  wordmark: string;
  tagline?: string;
  ctaLabel: string;
  logoUrl?: string;
  logoWidth?: number;
  logoHeight?: number;
};

const MINIMAL_HERO_FALLBACK: MinimalHero = {
  wordmark: "Sapiens",
  ctaLabel: "Join the movement",
};

export async function getMinimalHero(): Promise<MinimalHero> {
  const cms = await cmsFetch<Partial<MinimalHero> | null>(
    groq`*[_type == "minimalHero"][0]{
      wordmark, tagline, ctaLabel,
      "logoUrl": logo.asset->url,
      "logoWidth": logo.asset->metadata.dimensions.width,
      "logoHeight": logo.asset->metadata.dimensions.height
    }`,
    null
  );
  return {
    ...MINIMAL_HERO_FALLBACK,
    ...(cms
      ? Object.fromEntries(
          Object.entries(cms).filter(([, v]) => v !== null && v !== "")
        )
      : {}),
  };
}

/* ---- stories (S5) ---- */

export type Story = {
  title: string;
  body: string;
  doodleKey: string;
  isReal?: boolean;
  videoUrl?: string;
};

export async function getStories(fallback: Story[]): Promise<Story[]> {
  const rows = await cmsFetch<Story[]>(
    groq`*[_type == "story"] | order(order asc){ title, body, doodleKey, isReal, videoUrl }`,
    []
  );
  return rows.length ? rows : fallback;
}

/* ---- FAQ (/contact) ---- */

export type Faq = { question: string; answer: string };

export async function getFaqs(fallback: Faq[]): Promise<Faq[]> {
  const rows = await cmsFetch<Faq[]>(
    groq`*[_type == "faqItem"] | order(order asc){ question, answer }`,
    []
  );
  return rows.length ? rows : fallback;
}

/* ---- journey stages (S6) ---- */

export type JourneyStage = { threshold: number; name: string; caption: string };

export async function getJourneyStages(
  fallback: JourneyStage[]
): Promise<JourneyStage[]> {
  const rows = await cmsFetch<JourneyStage[]>(
    groq`*[_type == "journeyStage"] | order(threshold asc){ threshold, name, caption }`,
    []
  );
  return rows.length ? rows : fallback;
}

/* ---- milestones (celebration thresholds, HUD dots in S6) ---- */

export type Milestone = { helps: number; label: string; caption: string };

export async function getMilestones(
  fallback: Milestone[]
): Promise<Milestone[]> {
  const rows = await cmsFetch<Milestone[]>(
    groq`*[_type == "milestone"] | order(helps asc){ helps, label, caption }`,
    []
  );
  return rows.length ? rows : fallback;
}

/* ---- shop tease items ---- */

export type ShopItem = { name: string; doodleKey: string; stampText: string };

export async function getShopItems(fallback: ShopItem[]): Promise<ShopItem[]> {
  const rows = await cmsFetch<ShopItem[]>(
    groq`*[_type == "shopTeaseItem"] | order(order asc){ name, doodleKey, stampText }`,
    []
  );
  return rows.length ? rows : fallback;
}

/* ---- inner pages (Level-2 CMS) ---- */

// Portable Text is an array of blocks; keep it loose to avoid a hard dep
// on @portabletext types in this server module.
export type PortableBlocks = unknown[];

export type ProsePage = { title?: string; content?: PortableBlocks };

export async function getProsePage(
  slug: "why" | "privacy" | "terms"
): Promise<ProsePage | null> {
  return cmsFetch<ProsePage | null>(
    groq`*[_type == "prosePage" && slug == $slug][0]{ title, content }`,
    null,
    { slug }
  );
}

export type PageWhat = {
  heading?: string;
  weDont?: string[];
  weDo?: string[];
  kindnessHeading?: string;
  kindnessIntro?: string;
  kindnessChips?: string[];
  closing?: string;
};
export async function getPageWhat(): Promise<PageWhat | null> {
  return cmsFetch<PageWhat | null>(
    groq`*[_type == "pageWhat"][0]{ heading, weDont, weDo, kindnessHeading, kindnessIntro, kindnessChips, closing }`,
    null
  );
}

export type PageHowStep = { title: string; body: string; doodleKey: string };
export type PageHowSafety = { title: string; body: string };
export type PageHow = {
  heading?: string;
  steps?: PageHowStep[];
  safetyHeading?: string;
  safety?: PageHowSafety[];
  safetyLine?: string;
};
export async function getPageHow(): Promise<PageHow | null> {
  return cmsFetch<PageHow | null>(
    groq`*[_type == "pageHow"][0]{ heading, steps, safetyHeading, safety, safetyLine }`,
    null
  );
}

export type PagePerk = { title: string; body: string };
export type PageClub = {
  heading?: string;
  tagline?: string;
  waitlistHeading?: string;
  waitlistIntro?: string;
  foundingHeading?: string;
  foundingIntro?: string;
  perks?: PagePerk[];
  orgHeading?: string;
  orgBody?: string;
  orgPoints?: string[];
};
export async function getPageClub(): Promise<PageClub | null> {
  return cmsFetch<PageClub | null>(
    groq`*[_type == "pageClub"][0]{ heading, tagline, waitlistHeading, waitlistIntro, foundingHeading, foundingIntro, perks, orgHeading, orgBody, orgPoints }`,
    null
  );
}

export type PageIntro = { heading?: string; intro?: string };
export async function getPageIntro(
  slug: "contact" | "shop"
): Promise<PageIntro | null> {
  return cmsFetch<PageIntro | null>(
    groq`*[_type == "pageIntro" && slug == $slug][0]{ heading, intro }`,
    null,
    { slug }
  );
}

/* ---- home section heading overrides (s2..s9) ---- */

export type HomeSection = { key: string; heading?: string; subheading?: string };

export async function getHomeSection(key: string): Promise<HomeSection | null> {
  const rows = await cmsFetch<HomeSection[]>(
    groq`*[_type == "homeSection"]{ key, heading, subheading }`,
    []
  );
  return rows.find((r) => r.key === key) ?? null;
}
