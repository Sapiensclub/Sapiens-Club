import Link from "next/link";

/*
 * Sketch-style buttons (spec §2.4). The irregular hand-drawn border comes
 * from the asymmetric border-radius trick (.sketch-border in globals.css).
 * Hover: slight rotate + scale, and a small spark sparkle pops at the
 * top-right corner (.btn-sparkle).
 *
 * Variants: primary / secondary for paper sections,
 *           gold / moonlight for night sections.
 */
export type ButtonVariant = "primary" | "secondary" | "gold" | "moonlight";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-spark text-ink",
  secondary: "border-2 border-ink text-ink",
  gold: "bg-gold text-night",
  moonlight: "border-2 border-moonlight text-moonlight",
};

const BASE =
  "sketch-border group relative inline-flex items-center justify-center px-7 py-3 " +
  "text-lg font-bold transition-transform duration-200 ease-out " +
  "hover:-rotate-1 hover:scale-[1.03] active:scale-95 select-none";

function Sparkle() {
  return (
    <span aria-hidden className="btn-sparkle">
      <svg viewBox="0 0 32 32" className="h-4 w-4 text-spark">
        <path
          fill="currentColor"
          d="M16 3 C17 10 19 14 27 16 C19 18 17 22 16 29 C15 22 13 18 5 16 C13 14 15 10 16 3 Z"
        />
      </svg>
    </span>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  newTab = false,
  className = "",
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  newTab?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"a">) {
  return (
    <Link
      href={href}
      className={`${BASE} ${VARIANT[variant]} ${className}`}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
      <Sparkle />
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"button">) {
  return (
    <button className={`${BASE} ${VARIANT[variant]} ${className}`} {...rest}>
      {children}
      <Sparkle />
    </button>
  );
}
