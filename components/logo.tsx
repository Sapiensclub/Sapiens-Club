import Link from "next/link";
import { SOLE, TOES, LOGO_VIEWBOX } from "./logo-paths";

/*
 * Static footprint-S mark. Colour follows `currentColor`, so it inverts
 * automatically on night sections. `bounce` enables the walking toe-bounce
 * on hover of a parent with the `group` class (spec §3).
 */
export function LogoMark({
  className = "",
  bounce = false,
  title,
}: {
  className?: string;
  bounce?: boolean;
  title?: string;
}) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {SOLE.map((d, i) => (
        <path key={`s${i}`} d={d} fill="currentColor" />
      ))}
      {TOES.map((d, i) => (
        <path
          key={`t${i}`}
          d={d}
          fill="currentColor"
          className={bounce ? "toe" : undefined}
          style={bounce ? ({ "--toe": i } as React.CSSProperties) : undefined}
        />
      ))}
    </svg>
  );
}

/* Logo + wordmark, used in the header. */
export function LogoLockup({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-2 ${className}`}
      aria-label="Sapiens — home"
    >
      <LogoMark bounce className="h-10 w-auto" />
      <span className="font-display text-2xl font-bold tracking-wide">
        Sapiens
      </span>
    </Link>
  );
}
