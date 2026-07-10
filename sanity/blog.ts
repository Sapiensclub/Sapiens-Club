import { groq } from "next-sanity";
import { client, projectId } from "./client";

/*
 * BLOG DATA LAYER (Blog Build Spec §7.2) — every blog GROQ query in one
 * file (spec §8: removable by deleting this file). Follows the site's
 * existing pattern: reads tagged 'content' so the existing
 * /api/revalidate webhook refreshes blog pages the moment anything is
 * published in the Studio; revalidate 3600 is the safety-net fallback.
 *
 * Publicly visible = publishedAt in the past. Drafts and future-dated
 * posts never leave the CMS.
 */
const FETCH_OPTS = { next: { tags: ["content"], revalidate: 3600 } };

async function blogFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T
): Promise<T> {
  if (!projectId) return fallback;
  try {
    const data = await client.fetch<T>(query, params, FETCH_OPTS);
    return data ?? fallback;
  } catch (err) {
    console.error("[blog] fetch failed:", err);
    return fallback;
  }
}

/* ---------- types ---------- */

export type BlogImage = {
  url: string;
  alt?: string;
  caption?: string;
  w?: number;
  h?: number;
  lqip?: string;
} | null;

export type BlogCategory = {
  title: string;
  slug: string;
  description?: string;
};

export type BlogAuthor = {
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  credentials?: string;
  avatarUrl?: string;
  social?: { platform?: string; url?: string }[];
};

export type BlogCard = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  featured?: boolean;
  category: { title: string; slug: string } | null;
  author: { name: string; slug: string; avatarUrl?: string } | null;
  cover: BlogImage;
  /** plain-text character count of the body — reading time is derived */
  chars?: number;
};

export type BlogPostFull = BlogCard & {
  updatedAt?: string;
  tags?: string[];
  body: unknown[];
  authorFull: BlogAuthor | null;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImageUrl?: string;
  } | null;
};

/** ~200 wpm, ~5 chars/word — computed, never stored (spec §2) */
export function readingMinutes(chars: number | undefined): number {
  return Math.max(1, Math.round((chars ?? 0) / 5 / 200));
}

/* ---------- shared projections ---------- */

const PUBLISHED = `_type == "blogPost" && defined(slug.current) && publishedAt <= now()`;

const CARD = `{
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  "category": category->{ title, "slug": slug.current },
  "author": author->{ name, "slug": slug.current, "avatarUrl": avatar.asset->url },
  "cover": coverImage{
    "url": asset->url, alt, caption,
    "w": asset->metadata.dimensions.width,
    "h": asset->metadata.dimensions.height,
    "lqip": asset->metadata.lqip
  },
  "chars": length(pt::text(body))
}`;

/* body with image assets resolved so next/image gets real URLs + sizes */
const BODY = `body[]{
  ...,
  _type == "bodyImage" => {
    ...,
    "url": asset->url,
    "w": asset->metadata.dimensions.width,
    "h": asset->metadata.dimensions.height,
    "lqip": asset->metadata.lqip
  },
  _type == "gallery" => {
    ...,
    images[]{
      ...,
      "url": asset->url,
      "w": asset->metadata.dimensions.width,
      "h": asset->metadata.dimensions.height,
      "lqip": asset->metadata.lqip
    }
  }
}`;

const AUTHOR_FULL = `{
  name, "slug": slug.current, role, bio, credentials,
  "avatarUrl": avatar.asset->url,
  social[]{ platform, url }
}`;

/* ---------- queries ---------- */

export const POSTS_PER_PAGE = 12;

/** count of live posts — powers the conditional nav link (spec §5) */
export async function getPublishedPostCount(): Promise<number> {
  return blogFetch<number>(groq`count(*[${PUBLISHED}])`, {}, 0);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return blogFetch<BlogCategory[]>(
    groq`*[_type == "category" && defined(slug.current)] | order(title asc)
      { title, "slug": slug.current, description }`,
    {},
    []
  );
}

/** newest featured post, else newest overall (spec §4 featured slot) */
export async function getFeaturedPost(): Promise<BlogCard | null> {
  const r = await blogFetch<{ featured: BlogCard | null; newest: BlogCard | null }>(
    groq`{
      "featured": *[${PUBLISHED} && featured == true] | order(publishedAt desc)[0]${CARD},
      "newest": *[${PUBLISHED}] | order(publishedAt desc)[0]${CARD}
    }`,
    {},
    { featured: null, newest: null }
  );
  return r.featured ?? r.newest;
}

/** paginated grid; excludeSlug keeps the featured post out of the grid */
export async function getPostsPage(
  page: number,
  excludeSlug?: string
): Promise<{ posts: BlogCard[]; total: number }> {
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE;
  return blogFetch<{ posts: BlogCard[]; total: number }>(
    groq`{
      "posts": *[${PUBLISHED} && slug.current != $excludeSlug]
        | order(publishedAt desc) [$from...$to]${CARD},
      "total": count(*[${PUBLISHED} && slug.current != $excludeSlug])
    }`,
    { from, to, excludeSlug: excludeSlug ?? "" },
    { posts: [], total: 0 }
  );
}

export async function getPost(slug: string): Promise<BlogPostFull | null> {
  return blogFetch<BlogPostFull | null>(
    groq`*[${PUBLISHED} && slug.current == $slug][0]{
      ...${CARD},
      updatedAt,
      tags,
      "authorFull": author->${AUTHOR_FULL},
      "seo": seo{ metaTitle, metaDescription, "ogImageUrl": ogImage.asset->url },
      ${BODY}
    }`,
    { slug },
    null
  );
}

export async function getCategoryWithPosts(
  slug: string
): Promise<{ category: BlogCategory; posts: BlogCard[] } | null> {
  const r = await blogFetch<{
    category: BlogCategory | null;
    posts: BlogCard[];
  }>(
    groq`{
      "category": *[_type == "category" && slug.current == $slug][0]
        { title, "slug": slug.current, description },
      "posts": *[${PUBLISHED} && category->slug.current == $slug]
        | order(publishedAt desc)${CARD}
    }`,
    { slug },
    { category: null, posts: [] }
  );
  return r.category ? { category: r.category, posts: r.posts } : null;
}

export async function getAuthorWithPosts(
  slug: string
): Promise<{ author: BlogAuthor; posts: BlogCard[] } | null> {
  const r = await blogFetch<{ author: BlogAuthor | null; posts: BlogCard[] }>(
    groq`{
      "author": *[_type == "author" && slug.current == $slug][0]${AUTHOR_FULL},
      "posts": *[${PUBLISHED} && author->slug.current == $slug]
        | order(publishedAt desc)${CARD}
    }`,
    { slug },
    { author: null, posts: [] }
  );
  return r.author ? { author: r.author, posts: r.posts } : null;
}

/** 3 more from the same category, excluding the current post (spec §4) */
export async function getRelatedPosts(
  categorySlug: string,
  excludeSlug: string
): Promise<BlogCard[]> {
  return blogFetch<BlogCard[]>(
    groq`*[${PUBLISHED} && category->slug.current == $categorySlug
        && slug.current != $excludeSlug]
      | order(publishedAt desc) [0...3]${CARD}`,
    { categorySlug, excludeSlug },
    []
  );
}

/** lightweight list for sitemap + RSS (stage 7) */
export async function getAllPostsMeta(): Promise<
  { slug: string; title: string; excerpt: string; publishedAt: string; updatedAt?: string }[]
> {
  return blogFetch(
    groq`*[${PUBLISHED}] | order(publishedAt desc)
      { "slug": slug.current, title, excerpt, publishedAt, updatedAt }`,
    {},
    []
  );
}

/** slugs for generateStaticParams (stage 4) */
export async function getAllBlogSlugs(): Promise<{
  posts: string[];
  categories: string[];
  authors: string[];
}> {
  return blogFetch(
    groq`{
      "posts": *[${PUBLISHED}].slug.current,
      "categories": *[_type == "category" && defined(slug.current)].slug.current,
      "authors": *[_type == "author" && defined(slug.current)].slug.current
    }`,
    {},
    { posts: [], categories: [], authors: [] }
  );
}
