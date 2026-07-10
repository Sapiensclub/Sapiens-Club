import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, type Crumb } from "@/components/blog/breadcrumb";
import { AuthorAvatar, PostGrid } from "@/components/blog/post-card";
import {
  JsonLd,
  breadcrumbSchema,
  profilePageSchema,
  SITE_OG_IMAGE,
} from "@/components/blog/json-ld";
import { getAllBlogSlugs, getAuthorWithPosts } from "@/sanity/blog";

/*
 * /blog/author/[slug] — the E-E-A-T authority page (Blog Build Spec §4).
 * The visible social links here are the same URLs emitted as Person
 * `sameAs` structured data in stage 6.
 */
export const revalidate = 3600;

export async function generateStaticParams() {
  const { authors } = await getAllBlogSlugs();
  return authors.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAuthorWithPosts(slug);
  if (!data) return { title: "Author not found" };

  const title = `${data.author.name} — author at Sapiens`;
  const description =
    data.author.bio ?? `Posts written by ${data.author.name} on the Sapiens blog.`;
  const canonical = `/blog/author/${data.author.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "profile",
      url: canonical,
      title,
      description,
      images: [data.author.avatarUrl ?? SITE_OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [data.author.avatarUrl ?? SITE_OG_IMAGE],
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getAuthorWithPosts(slug);
  if (!data) notFound();
  const { author, posts } = data;
  const socials = (author.social ?? []).filter((s) => s.url);

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: author.name },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <JsonLd data={profilePageSchema(author)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <Breadcrumb items={crumbs} />

      <header className="sketch-border mt-10 flex flex-col items-center gap-5 border-2 border-ink/50 px-8 py-10 text-center">
        <AuthorAvatar name={author.name} avatarUrl={author.avatarUrl} size={96} />
        <div>
          <h1 className="!text-4xl">{author.name}</h1>
          {author.role && <p className="mt-2 font-semibold">{author.role}</p>}
        </div>
        {author.bio && (
          <p className="max-w-2xl leading-relaxed">{author.bio}</p>
        )}
        {author.credentials && (
          <p className="max-w-2xl text-sm opacity-75">{author.credentials}</p>
        )}
        {socials.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold">
            {socials.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="underline decoration-spark decoration-2 underline-offset-4 hover:text-clay"
                >
                  {s.platform ?? "Profile"}
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      <section aria-label={`Posts by ${author.name}`} className="mt-16">
        <h2 className="text-center">
          {posts.length === 1 ? "1 post" : `${posts.length} posts`}
        </h2>
        <div className="mt-10">
          {posts.length ? (
            <PostGrid posts={posts} />
          ) : (
            <p className="text-center text-lg opacity-70">No posts yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
