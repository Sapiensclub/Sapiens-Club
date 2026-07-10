import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryFilter } from "@/components/blog/category-filter";
import { PostGrid } from "@/components/blog/post-card";
import { Pagination } from "@/components/blog/pagination";
import {
  getBlogCategories,
  getFeaturedPost,
  getPostsPage,
  POSTS_PER_PAGE,
} from "@/sanity/blog";

/*
 * /blog/page/[n] — pages 2+ of the index (Blog Build Spec §4). Page 1 is
 * /blog, so /blog/page/1 404s rather than duplicating it.
 */
export const revalidate = 3600;

export async function generateStaticParams() {
  const featured = await getFeaturedPost();
  const { total } = await getPostsPage(1, featured?.slug);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `The Sapiens Blog — page ${page}`,
    description:
      "More stories, safety thinking and the science of kindness from the people building Sapiens.",
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: raw } = await params;
  const page = Number(raw);
  if (!Number.isInteger(page) || page < 2) notFound();

  const [featured, categories] = await Promise.all([
    getFeaturedPost(),
    getBlogCategories(),
  ]);
  const { posts, total } = await getPostsPage(page, featured?.slug);
  if (!posts.length) notFound();

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <header className="text-center">
        <h1>The Sapiens Blog</h1>
        <p className="mt-4 text-lg opacity-70">Page {page}</p>
      </header>

      <div className="mt-14">
        <CategoryFilter categories={categories} />
      </div>

      <section aria-label="Posts" className="mt-14">
        <PostGrid posts={posts} />
      </section>

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
