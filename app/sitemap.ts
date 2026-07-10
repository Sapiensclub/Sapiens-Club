import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPostsMeta, getBlogCategories, getAllBlogSlugs } from "@/sanity/blog";

/*
 * sitemap.xml — the static site pages, plus every published blog post,
 * category and author, pulled live from the CMS (Blog Build Spec §5).
 *
 * Nothing here is maintained by hand: publishing a post in the Studio
 * fires the existing revalidate webhook, which clears the 'content' tag
 * these queries are tagged with, so the next fetch of /sitemap.xml
 * includes the new URL. Drafts and future-dated posts are excluded by the
 * same filter that hides them from the site.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/what",
    "/why",
    "/how",
    "/club",
    "/contact",
    "/shop",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  /* ---- blog (additive; remove this block to remove the blog) ---- */
  const [posts, categories, slugs] = await Promise.all([
    getAllPostsMeta(),
    getBlogCategories(),
    getAllBlogSlugs(),
  ]);

  if (posts.length) {
    entries.push({
      url: `${site.url}/blog`,
      lastModified: new Date(posts[0].publishedAt),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const post of posts) {
    entries.push({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const category of categories) {
    entries.push({
      url: `${site.url}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const author of slugs.authors) {
    entries.push({
      url: `${site.url}/blog/author/${author}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
