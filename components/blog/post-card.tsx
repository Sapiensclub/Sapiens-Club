import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { readingMinutes, type BlogCard } from "@/sanity/blog";

/*
 * Post cards (Blog Build Spec §4) — used by the blog index, category and
 * author pages, and by related posts (stage 5). Cover images are optional;
 * without one we fall back to a calm paper panel with the footprint mark,
 * so a post never looks broken before its image is uploaded.
 */

export function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AuthorAvatar({
  name,
  avatarUrl,
  size = 28,
}: {
  name: string;
  avatarUrl?: string;
  size?: number;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-dawn font-display font-bold"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function CategoryTag({ title, slug }: { title: string; slug: string }) {
  return (
    <Link
      href={`/blog/category/${slug}`}
      className="sketch-border inline-block border-2 border-ink/50 px-3 py-1 text-xs font-bold uppercase tracking-wide hover:border-spark hover:text-clay"
    >
      {title}
    </Link>
  );
}

function Cover({
  post,
  priority = false,
  className = "",
}: {
  post: BlogCard;
  priority?: boolean;
  className?: string;
}) {
  const cover = post.cover;
  if (cover?.url && cover.w && cover.h) {
    return (
      <Image
        src={cover.url}
        alt={cover.alt ?? ""}
        width={cover.w}
        height={cover.h}
        priority={priority}
        placeholder={cover.lqip ? "blur" : undefined}
        blurDataURL={cover.lqip}
        sizes="(max-width: 768px) 100vw, 640px"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`flex h-full w-full items-center justify-center bg-dawn ${className}`}
    >
      <LogoMark className="h-14 w-auto opacity-25" />
    </span>
  );
}

function Byline({ post }: { post: BlogCard }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm opacity-75">
      {post.author && (
        <>
          <AuthorAvatar name={post.author.name} avatarUrl={post.author.avatarUrl} size={24} />
          <span className="font-semibold">{post.author.name}</span>
          <span aria-hidden>·</span>
        </>
      )}
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span>{readingMinutes(post.chars)} min read</span>
    </div>
  );
}

/** Large card for the featured slot on the blog index. */
export function FeaturedPostCard({ post }: { post: BlogCard }) {
  return (
    <article className="sketch-border overflow-hidden border-2 border-ink/60">
      <div className="grid md:grid-cols-2">
        <Link
          href={`/blog/${post.slug}`}
          className="relative block aspect-[16/10] md:aspect-auto md:h-full"
          tabIndex={-1}
          aria-hidden
        >
          <Cover post={post} priority />
        </Link>
        <div className="flex flex-col items-start gap-4 px-7 py-8">
          {post.category && <CategoryTag {...post.category} />}
          <h2 className="!text-3xl">
            <Link href={`/blog/${post.slug}`} className="hover:text-clay">
              {post.title}
            </Link>
          </h2>
          <p className="leading-relaxed">{post.excerpt}</p>
          <Byline post={post} />
        </div>
      </div>
    </article>
  );
}

/** Grid card. */
export function PostCard({ post }: { post: BlogCard }) {
  return (
    <article className="sketch-border flex h-full flex-col overflow-hidden border-2 border-ink/50">
      <Link
        href={`/blog/${post.slug}`}
        className="block aspect-[16/10]"
        tabIndex={-1}
        aria-hidden
      >
        <Cover post={post} />
      </Link>
      <div className="flex flex-1 flex-col items-start gap-3 px-6 py-6">
        {post.category && <CategoryTag {...post.category} />}
        <h3 className="font-display text-xl font-bold leading-snug">
          <Link href={`/blog/${post.slug}`} className="hover:text-clay">
            {post.title}
          </Link>
        </h3>
        <p className="flex-1 text-sm leading-relaxed">{post.excerpt}</p>
        <Byline post={post} />
      </div>
    </article>
  );
}

/** Reusable responsive grid. */
export function PostGrid({ posts }: { posts: BlogCard[] }) {
  if (!posts.length) return null;
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
