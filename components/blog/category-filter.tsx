import Link from "next/link";
import { SquiggleUnderline } from "@/components/doodles/basics";
import type { BlogCategory } from "@/sanity/blog";

/*
 * Category filter row (Blog Build Spec §4). Active item gets the same
 * hand-drawn squiggle underline the main site nav uses.
 */
export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: BlogCategory[];
  activeSlug?: string;
}) {
  if (!categories.length) return null;

  const items = [
    { title: "All", slug: undefined as string | undefined },
    ...categories.map((c) => ({ title: c.title, slug: c.slug })),
  ];

  return (
    <nav aria-label="Post categories">
      <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
        {items.map(({ title, slug }) => {
          const active = slug === activeSlug;
          return (
            <li key={title}>
              <Link
                href={slug ? `/blog/category/${slug}` : "/blog"}
                aria-current={active ? "page" : undefined}
                className="font-display relative text-lg font-bold hover:opacity-70"
              >
                {title}
                {active && (
                  <SquiggleUnderline className="absolute -bottom-2 left-0 h-2.5 w-full text-spark" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
