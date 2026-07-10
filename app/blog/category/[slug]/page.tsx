import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, type Crumb } from "@/components/blog/breadcrumb";
import { CategoryFilter } from "@/components/blog/category-filter";
import { PostGrid } from "@/components/blog/post-card";
import {
  JsonLd,
  breadcrumbSchema,
  collectionPageSchema,
  SITE_OG_IMAGE,
} from "@/components/blog/json-ld";
import {
  getAllBlogSlugs,
  getBlogCategories,
  getCategoryWithPosts,
} from "@/sanity/blog";

/*
 * /blog/category/[slug] (Blog Build Spec §4) — H1 + intro for topical
 * targeting, then the grid. CollectionPage + BreadcrumbList schema in
 * stage 6.
 */
export const revalidate = 3600;

export async function generateStaticParams() {
  const { categories } = await getAllBlogSlugs();
  return categories.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryWithPosts(slug);
  if (!data) return { title: "Category not found" };

  const title = `${data.category.title} — The Sapiens Blog`;
  const description =
    data.category.description ??
    `Posts about ${data.category.title} from the Sapiens blog.`;
  const canonical = `/blog/category/${data.category.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [SITE_OG_IMAGE] },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [data, categories] = await Promise.all([
    getCategoryWithPosts(slug),
    getBlogCategories(),
  ]);
  if (!data) notFound();
  const { category, posts } = data;

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: category.title },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <JsonLd data={collectionPageSchema(category, posts.length)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <Breadcrumb items={crumbs} />

      <header className="mt-10 text-center">
        <h1>{category.title}</h1>
        {category.description && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed">
            {category.description}
          </p>
        )}
      </header>

      <div className="mt-14">
        <CategoryFilter categories={categories} activeSlug={category.slug} />
      </div>

      <section aria-label={`Posts in ${category.title}`} className="mt-14">
        {posts.length ? (
          <PostGrid posts={posts} />
        ) : (
          <p className="text-center text-lg opacity-70">
            No posts in this category yet.
          </p>
        )}
      </section>
    </div>
  );
}
