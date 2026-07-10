import Link from "next/link";

/*
 * Breadcrumb trail (Blog Build Spec §4). The visible trail; the matching
 * BreadcrumbList structured data is emitted in stage 6 from the same
 * `items` array, so the two can never drift apart.
 */
export type Crumb = { label: string; href?: string };

/*
 * Stays on a single line: the parent crumbs never shrink, and the final
 * crumb (often a long post title) truncates with an ellipsis. Previously a
 * long title wrapped, stranding a "/" at the end of the first line.
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm opacity-75">
      <ol className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={item.label}
              className={
                last
                  ? "flex min-w-0 items-center gap-2"
                  : "flex shrink-0 items-center gap-2"
              }
            >
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-clay">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className="truncate"
                  title={last ? item.label : undefined}
                >
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
