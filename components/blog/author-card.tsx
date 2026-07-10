import Link from "next/link";
import { AuthorAvatar } from "@/components/blog/post-card";
import type { BlogAuthor } from "@/sanity/blog";

/*
 * Author card at the foot of an article (Blog Build Spec §4) — reinforces
 * authorship for readers and for E-E-A-T. The social URLs shown here are
 * the same ones emitted as Person `sameAs` in stage 6.
 */
export function AuthorCard({ author }: { author: BlogAuthor }) {
  const socials = (author.social ?? []).filter((s) => s.url);

  return (
    <aside className="sketch-border mt-16 border-2 border-ink/50 bg-dawn px-7 py-8">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <Link href={`/blog/author/${author.slug}`} className="shrink-0">
          <AuthorAvatar name={author.name} avatarUrl={author.avatarUrl} size={72} />
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide opacity-60">
            Written by
          </p>
          <h2 className="font-display mt-1 !text-2xl">
            <Link href={`/blog/author/${author.slug}`} className="hover:text-clay">
              {author.name}
            </Link>
          </h2>
          {author.role && (
            <p className="mt-1 text-sm font-semibold">{author.role}</p>
          )}
          {author.bio && (
            <p className="mt-3 leading-relaxed">{author.bio}</p>
          )}
          {author.credentials && (
            <p className="mt-2 text-sm opacity-75">{author.credentials}</p>
          )}
          {socials.length > 0 && (
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold sm:justify-start">
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
        </div>
      </div>
    </aside>
  );
}
