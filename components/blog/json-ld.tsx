import { site } from "@/lib/site";
import type { Crumb } from "@/components/blog/breadcrumb";
import type { BlogAuthor, BlogCategory, BlogPostFull } from "@/sanity/blog";

/*
 * Structured data (Blog Build Spec §6). Server-rendered JSON-LD, matching
 * the pattern already used in app/layout.tsx and app/contact/page.tsx.
 *
 * The authority mechanism: the author's social URLs become Person.sameAs,
 * emitted on both the post and the author page.
 */

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** absolute URL for schema.org (relative paths are not valid there) */
export const abs = (path: string) =>
  path.startsWith("http") ? path : `${site.url}${path}`;

/*
 * The site's generated share card (app/opengraph-image.tsx). Needed as an
 * explicit fallback: a page that defines its own `openGraph` block REPLACES
 * the root one, so a post without a cover would otherwise have no share
 * image at all.
 */
export const SITE_OG_IMAGE = "/opengraph-image";

/** Sanity CDN images resized to the 1200×630 social-card ratio */
export function ogImageUrl(url?: string): string {
  if (!url) return SITE_OG_IMAGE;
  return url.includes("cdn.sanity.io")
    ? `${url}?w=1200&h=630&fit=crop&auto=format`
    : url;
}

const publisher = {
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: { "@type": "ImageObject", url: `${site.url}/logo.svg` },
};

export function personSchema(author: BlogAuthor) {
  const sameAs = (author.social ?? [])
    .map((s) => s.url)
    .filter((u): u is string => Boolean(u));
  return {
    "@type": "Person",
    name: author.name,
    url: abs(`/blog/author/${author.slug}`),
    ...(author.role ? { jobTitle: author.role } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.credentials ? { knowsAbout: author.credentials } : {}),
    ...(author.avatarUrl ? { image: author.avatarUrl } : {}),
    ...(sameAs.length ? { sameAs } : {}), // ← the E-E-A-T authority signal
  };
}

/** Built from the same Crumb[] the visible breadcrumb renders. */
export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: abs(c.href) } : {}),
    })),
  };
}

export function blogPostingSchema(post: BlogPostFull) {
  const canonical = abs(`/blog/${post.slug}`);
  /* abs(): schema.org requires absolute URLs, and the fallback is relative */
  const image = abs(ogImageUrl(post.seo?.ogImageUrl || post.cover?.url));
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: (post.seo?.metaTitle || post.title).slice(0, 110),
    description: post.seo?.metaDescription || post.excerpt,
    image: [image],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    ...(post.category ? { articleSection: post.category.title } : {}),
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    publisher,
    ...(post.authorFull ? { author: personSchema(post.authorFull) } : {}),
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function blogSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The Sapiens Blog",
    description,
    url: abs("/blog"),
    publisher,
  };
}

export function collectionPageSchema(category: BlogCategory, count: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    ...(category.description ? { description: category.description } : {}),
    url: abs(`/blog/category/${category.slug}`),
    isPartOf: { "@type": "Blog", name: "The Sapiens Blog", url: abs("/blog") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: count,
    },
  };
}

export function profilePageSchema(author: BlogAuthor) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: personSchema(author),
  };
}
