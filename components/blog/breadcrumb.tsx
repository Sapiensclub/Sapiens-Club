import Link from "next/link";

/*
 * Breadcrumb trail (Blog Build Spec §4). The visible trail; the matching
 * BreadcrumbList structured data is emitted in stage 6 from the same
 * `items` array, so the two can never drift apart.
 */
export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm opacity-75">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-clay">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="line-clamp-1">
                  {item.label}
                </span>
              )}
              {!last && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
