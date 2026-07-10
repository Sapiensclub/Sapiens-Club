/*
 * Doodle SVG library, part 1 — simple marks (spec §2.3).
 * Hand-drawn line style: 2.5px round-cap strokes, slightly wobbly paths,
 * ink via currentColor; spark used only as fill accents.
 *
 * Conventions (see doodle.tsx):
 *   className="dd" + pathLength={1} → stroke draws itself on viewport entry
 *   className="ddf"                 → filled accent, pops in after strokes
 * Pass `title` to make a doodle meaningful to screen readers; otherwise
 * it is decorative (aria-hidden).
 */

type DoodleProps = { className?: string; title?: string };

/* shared stroke style */
const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Svg({
  viewBox,
  className,
  title,
  preserveAspectRatio,
  children,
}: DoodleProps & {
  viewBox: string;
  preserveAspectRatio?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

export function CloudA(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 96 44" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M14 34 C7 34 5 26 11 23 C9 15 19 10 25 14 C28 6 41 5 46 12 C53 8 63 12 61 20 C70 21 71 32 62 34 C46 35.5 30 35 14 34"
      />
    </Svg>
  );
}

export function CloudB(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 80 40" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M12 30 C5 30 5 22 11 20 C10 13 19 9 25 12 C29 5 42 6 45 13 C53 10 60 16 57 22 C64 24 62 31 55 30.5 C41 32 26 31 12 30"
      />
    </Svg>
  );
}

export function CloudC(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 64 32" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M10 24 C4 24 4 17 9 16 C9 10 17 7 21 10 C25 4 35 5 38 11 C45 9 50 15 47 19 C52 21 50 25 45 24.5 C33 26 21 25 10 24"
      />
    </Svg>
  );
}

export function SunDoodle(p: DoodleProps) {
  const rays = [
    "M36 2 L36 9",
    "M59 12 L54 17",
    "M70 36 L63 36",
    "M59 60 L54 55",
    "M36 70 L36 63",
    "M13 60 L18 55",
    "M2 36 L9 36",
    "M13 12 L18 17",
  ];
  return (
    <Svg viewBox="0 0 72 72" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M36 14 C48 12 60 24 58 36 C60 48 47 59 36 58 C24 60 13 47 14 36 C12 24 24 13 36 14 Z"
      />
      {rays.map((d, i) => (
        <path
          key={i}
          {...S}
          pathLength={1}
          className="dd"
          d={d}
          style={{ "--i": (i % 4) + 1 } as React.CSSProperties}
        />
      ))}
    </Svg>
  );
}

export function SparkleA(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 48 48" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M24 4 C25 14 28 20 40 24 C28 28 25 34 24 44 C23 34 20 28 8 24 C20 20 23 14 24 4 Z"
      />
    </Svg>
  );
}

/* Small filled sparkle — inherits currentColor; wrap in text-spark for orange. */
export function SparkleB(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 32 32" {...p}>
      <path
        className="ddf"
        fill="currentColor"
        d="M16 3 C17 10 19 14 27 16 C19 18 17 22 16 29 C15 22 13 18 5 16 C13 14 15 10 16 3 Z"
      />
    </Svg>
  );
}

export function ArrowCurved(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 72 56" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M6 44 C22 50 44 42 55 21"
      />
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M56 20 L47 22 M56 20 L54 30"
        style={{ "--i": 1 } as React.CSSProperties}
      />
    </Svg>
  );
}

export function PaperPlane(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 72 60" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M6 34 L64 8 L38 54 L30 38 L6 34 Z"
      />
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M64 8 L30 38"
        style={{ "--i": 1 } as React.CSSProperties}
      />
    </Svg>
  );
}

export function HeartDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 56 52" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M28 46 C10 32 4 20 10 12 C16 5 26 8 28 16 C30 8 40 5 46 12 C52 20 46 32 28 46 Z"
      />
    </Svg>
  );
}

export function ShieldDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 56 64" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M28 4 C36 9 45 11 51 11 C52 34 45 51 28 60 C11 51 4 34 5 11 C11 11 20 9 28 4 Z"
      />
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M18 32 L25 40 L39 22"
        style={{ "--i": 1 } as React.CSSProperties}
      />
    </Svg>
  );
}

export function ToteBag(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 48 52" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M8 18 C8 18 10 45 11 46 C20 48.5 28 48.5 37 46 C38 44 40 18 40 18 C29 16.5 19 16.5 8 18 Z"
      />
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M17 17 C16 5 32 5 31 17"
        style={{ "--i": 1 } as React.CSSProperties}
      />
    </Svg>
  );
}

/*
 * Diya (footer flourish). The flame flickers by swapping two frames
 * (CSS: .diya-flame-a / .diya-flame-b in globals.css); reduced-motion
 * shows frame A only.
 */
export function DiyaDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 64 56" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M10 34 C12 46 24 52 32 52 C40 52 52 46 54 34 C39 37.5 25 37.5 10 34 Z"
      />
      <path
        className="diya-flame-a"
        fill="var(--color-spark)"
        d="M32 12 C36 18 38 24 32 30 C26 24 28 18 32 12 Z"
      />
      <path
        className="diya-flame-b"
        fill="var(--color-spark)"
        d="M32 10 C38 17 37 25 31 30 C26 23 29 16 32 10 Z"
      />
    </Svg>
  );
}

/* Hand-drawn squiggle used as the active-page underline in the nav. */
/*
 * Active-nav underline. preserveAspectRatio="none" lets it stretch to any
 * word width without growing taller, and vector-effect keeps the stroke a
 * constant thickness — otherwise a long label ("The Science of Kindness")
 * scales the SVG up and draws a much fatter line than a short one ("All").
 * Callers must set a height (e.g. `h-2.5 w-full`).
 */
export function SquiggleUnderline(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 80 10" preserveAspectRatio="none" {...p}>
      <path
        {...S}
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
        d="M3 6 C15 2 25 9 38 5 C51 1 63 8 77 4"
      />
    </Svg>
  );
}

/* Sketchy social icons (footer). */
export function IconInstagram(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 40 40" {...p}>
      <path
        {...S}
        d="M12 6 C7 6.5 6.5 7 6 12 C5.5 17 5.5 23 6 28 C6.5 33 7 33.5 12 34 C17 34.5 23 34.5 28 34 C33 33.5 33.5 33 34 28 C34.5 23 34.5 17 34 12 C33.5 7 33 6.5 28 6 C23 5.5 17 5.5 12 6 Z"
      />
      <path {...S} d="M20 13 C25 12.5 27.5 15 27 20 C26.5 25 25 27.5 20 27 C15 26.5 13.5 25 13 20 C12.5 15 15 13.5 20 13 Z" />
      <path {...S} strokeWidth={3.5} d="M29 11 L29.01 11" />
    </Svg>
  );
}

export function IconYouTube(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 44 34" {...p}>
      <path
        {...S}
        d="M9 5 C16 4 28 4 35 5 C39 5.5 39.5 7 40 11 C40.5 15 40.5 19 40 23 C39.5 27 39 28.5 35 29 C28 30 16 30 9 29 C5 28.5 4.5 27 4 23 C3.5 19 3.5 15 4 11 C4.5 7 5 5.5 9 5 Z"
      />
      <path fill="currentColor" stroke="none" d="M18 11 L29 17 L18 23 Z" />
    </Svg>
  );
}

export function IconX(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 36 36" {...p}>
      <path {...S} d="M6 5 C14 14 22 23 30 31" />
      <path {...S} d="M30 5 C22 14 14 23 6 31" />
    </Svg>
  );
}
