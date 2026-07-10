import type { Metadata } from "next";
import { Doodle } from "@/components/doodles/doodle";
import { SparkleA } from "@/components/doodles/basics";
import { CategoryFilter } from "@/components/blog/category-filter";
import { FeaturedPostCard, PostGrid } from "@/components/blog/post-card";
import { Pagination } from "@/components/blog/pagination";
import { JsonLd, blogSchema, SITE_OG_IMAGE } from "@/components/blog/json-ld";
import {
  getBlogCategories,
  getFeaturedPost,
  getPostsPage,
  POSTS_PER_PAGE,
} from "@/sanity/blog";

/*
 * /blog — the index (Blog Build Spec §4). Featured slot + category filter
 * + paginated grid. Static/ISR; the existing publish webhook refreshes it.
 * Full SEO/JSON-LD lands in stage 6.
 */
export const revalidate = 3600;

const BLOG_DESCRIPTION =
  "Stories, safety thinking and the science of kindness from the people building Sapiens — a society where helping each other is the default.";

export const metadata: Metadata = {
  title: "The Sapiens Blog — real help, safety & community",
  description: BLOG_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "The Sapiens Blog — real help, safety & community",
    description: BLOG_DESCRIPTION,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Sapiens Blog — real help, safety & community",
    description: BLOG_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
};

/* not exported — Next.js page files may only export its reserved keys */
const BLOG_INTRO =
  "Real help, safety, and what the science says about kindness — written as we build Sapiens.";

export default async function BlogIndex() {
  const [featured, categories] = await Promise.all([
    getFeaturedPost(),
    getBlogCategories(),
  ]);
  const { posts, total } = await getPostsPage(1, featured?.slug);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <JsonLd data={blogSchema(BLOG_DESCRIPTION)} />

      {/* page header */}
      <header className="relative text-center">
        <Doodle className="absolute -top-6 right-4 hidden w-12 text-spark sm:block">
          <SparkleA />
        </Doodle>
        <h1>The Sapiens Blog</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed">
          {BLOG_INTRO}
        </p>
      </header>

      {!featured ? (
        <p className="mt-20 text-center text-lg opacity-70">
          The first posts are being written. Check back soon.
        </p>
      ) : (
        <>
          <section aria-label="Featured post" className="mt-16">
            <FeaturedPostCard post={featured} />
          </section>

          <div className="mt-16">
            <CategoryFilter categories={categories} />
          </div>

          {posts.length > 0 && (
            <section aria-label="All posts" className="mt-14">
              <PostGrid posts={posts} />
            </section>
          )}

          <Pagination page={1} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
