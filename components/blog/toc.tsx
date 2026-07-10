import type { Heading } from "@/components/blog/portable";

/*
 * Table of Contents (Blog Build Spec §4) — built server-side from the
 * post's h2/h3 blocks. Pure links, no JavaScript: sticky rail on desktop,
 * a collapsible <details> on mobile. Hidden for short posts.
 */
export const TOC_MIN_HEADINGS = 3;

function Links({ headings }: { headings: Heading[] }) {
  return (
    <ol className="space-y-2 text-sm">
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? "pl-4" : undefined}>
          <a
            href={`#${h.id}`}
            className="opacity-75 hover:text-clay hover:opacity-100"
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function TableOfContents({
  headings,
  variant,
}: {
  headings: Heading[];
  variant: "sidebar" | "inline";
}) {
  if (headings.length < TOC_MIN_HEADINGS) return null;

  if (variant === "sidebar") {
    return (
      <nav
        aria-label="Table of contents"
        className="sticky top-24 hidden lg:block"
      >
        <p className="font-display text-lg font-bold">On this page</p>
        <div className="mt-4 border-l-2 border-ink/15 pl-4">
          <Links headings={headings} />
        </div>
      </nav>
    );
  }

  return (
    <details className="sketch-border mt-8 border-2 border-ink/40 px-5 py-3 lg:hidden">
      <summary className="cursor-pointer list-none font-display text-lg font-bold marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="mr-2 inline-block text-spark transition-transform group-open:rotate-90">
          ➤
        </span>
        On this page
      </summary>
      <nav aria-label="Table of contents" className="mt-3">
        <Links headings={headings} />
      </nav>
    </details>
  );
}
