import Link from "next/link";

/*
 * Numbered pagination (Blog Build Spec §4, ~12/page). Uses real URLs
 * (/blog, /blog/page/2 …) rather than query params so every page is
 * statically generated and fully crawlable without JavaScript.
 */
const href = (n: number) => (n <= 1 ? "/blog" : `/blog/page/${n}`);

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-3">
      {page > 1 && (
        <Link href={href(page - 1)} className="text-sm font-bold hover:text-clay">
          ← Newer
        </Link>
      )}
      <ul className="flex items-center gap-2">
        {pages.map((n) => (
          <li key={n}>
            <Link
              href={href(n)}
              aria-current={n === page ? "page" : undefined}
              className={`sketch-border inline-flex h-9 w-9 items-center justify-center border-2 text-sm font-bold ${
                n === page
                  ? "border-spark bg-spark text-night"
                  : "border-ink/40 hover:border-spark"
              }`}
            >
              {n}
            </Link>
          </li>
        ))}
      </ul>
      {page < totalPages && (
        <Link href={href(page + 1)} className="text-sm font-bold hover:text-clay">
          Older →
        </Link>
      )}
    </nav>
  );
}
