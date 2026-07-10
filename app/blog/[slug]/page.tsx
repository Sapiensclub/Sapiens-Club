import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/blog/breadcrumb";
import { AuthorAvatar, formatDate } from "@/components/blog/post-card";
import { BlogBody, extractHeadings } from "@/components/blog/portable";
import { TableOfContents } from "@/components/blog/toc";
import { ShareRow } from "@/components/blog/share-row";
import { AuthorCard } from "@/components/blog/author-card";
import { RelatedPosts } from "@/components/blog/related-posts";
import { BlogCtaBand } from "@/components/blog/cta-band";
import { site } from "@/lib/site";
import {
  getAllBlogSlugs,
  getPost,
  getRelatedPosts,
  readingMinutes,
} from "@/sanity/blog";

/*
 * /blog/[slug] — the single post (Blog Build Spec §4).
 * Breadcrumb, category tag, H1, byline, cover, TOC, body, share row,
 * author card, related posts, waitlist CTA. Stage 6 adds JSON-LD.
 */
export const revalidate = 3600;

export async function generateStaticParams() {
  const { posts } = await getAllBlogSlugs();
  return posts.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const author = post.authorFull;
  const cover = post.cover;
  const headings = extractHeadings(post.body);
  const related = post.category
    ? await getRelatedPosts(post.category.slug, post.slug)
    : [];
  const url = `${site.url}/blog/${post.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      {/* sticky TOC rail on desktop; the article stays a comfortable measure */}
      <div className="lg:grid lg:grid-cols-[minmax(0,70ch)_220px] lg:justify-center lg:gap-14">
        <article className="min-w-0">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              ...(post.category
                ? [
                    {
                      label: post.category.title,
                      href: `/blog/category/${post.category.slug}`,
                    },
                  ]
                : []),
              { label: post.title },
            ]}
          />

          <header className="mt-8">
            {post.category && (
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="sketch-border inline-block border-2 border-ink/50 px-3 py-1 text-xs font-bold uppercase tracking-wide hover:border-spark hover:text-clay"
              >
                {post.category.title}
              </Link>
            )}

            <h1 className="mt-5">{post.title}</h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm opacity-80">
              {author && (
                <>
                  <AuthorAvatar
                    name={author.name}
                    avatarUrl={author.avatarUrl}
                    size={32}
                  />
                  <Link
                    href={`/blog/author/${author.slug}`}
                    className="font-semibold hover:text-clay"
                  >
                    {author.name}
                  </Link>
                  {author.role && (
                    <span className="opacity-70">· {author.role}</span>
                  )}
                  <span aria-hidden>·</span>
                </>
              )}
              <span>
                Published{" "}
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              </span>
              {post.updatedAt && (
                <>
                  <span aria-hidden>·</span>
                  <span>
                    Updated{" "}
                    <time dateTime={post.updatedAt}>
                      {formatDate(post.updatedAt)}
                    </time>
                  </span>
                </>
              )}
              <span aria-hidden>·</span>
              <span>{readingMinutes(post.chars)} min read</span>
            </div>
          </header>

          {cover?.url && cover.w && cover.h && (
            <figure className="mt-10">
              <Image
                src={cover.url}
                alt={cover.alt ?? ""}
                width={cover.w}
                height={cover.h}
                priority
                placeholder={cover.lqip ? "blur" : undefined}
                blurDataURL={cover.lqip}
                sizes="(max-width: 768px) 100vw, 70ch"
                className="h-auto w-full rounded-lg"
              />
              {cover.caption && (
                <figcaption className="mt-2 text-center text-sm opacity-70">
                  {cover.caption}
                </figcaption>
              )}
            </figure>
          )}

          {/* mobile TOC sits in the flow, above the body */}
          <TableOfContents headings={headings} variant="inline" />

          <div className="mt-6 text-lg">
            <BlogBody value={post.body} />
          </div>

          {post.tags?.length ? (
            <ul className="mt-14 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-ink/25 px-3 py-1 text-xs opacity-75"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          ) : null}

          <ShareRow url={url} title={post.title} />

          {author && <AuthorCard author={author} />}
        </article>

        {/* desktop TOC rail */}
        <aside className="hidden lg:block">
          <TableOfContents headings={headings} variant="sidebar" />
        </aside>
      </div>

      <RelatedPosts posts={related} />
      <BlogCtaBand />
    </div>
  );
}
