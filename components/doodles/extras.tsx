/*
 * Doodle SVG library, part 3 — pieces for the homepage sections and inner
 * pages: sunrise (S9), moon (S6 static stand-in), shop products, and the
 * hand-drawn ✗ / ✓ marks for the /what page. Same conventions as basics.tsx.
 */

type DoodleProps = { className?: string; title?: string };

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
  children,
}: DoodleProps & { viewBox: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
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

const i = (n: number) => ({ "--i": n } as React.CSSProperties);

/* Sun rising over the horizon (S9 closing). */
export function SunriseDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 120 60" {...p}>
      <path {...S} pathLength={1} className="dd" d="M4 52 C40 50 80 50 116 52" />
      <path {...S} pathLength={1} className="dd" d="M30 52 C32 30 88 30 90 52" style={i(1)} />
      <path {...S} pathLength={1} className="dd" d="M60 12 L60 4" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M38 20 L33 14" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M82 20 L87 14" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M24 36 L16 32" style={i(3)} />
      <path {...S} pathLength={1} className="dd" d="M96 36 L104 32" style={i(3)} />
    </Svg>
  );
}

/* Crescent moon with two small stars (S6 static visual until the stage-7 scrub). */
export function MoonDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 72 72" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M46 10 C28 12 20 34 34 50 C18 48 8 32 14 18 C20 6 36 4 46 10 Z"
      />
      <path {...S} pathLength={1} className="dd" d="M54 22 C54.7 25 56 26.3 59 27 C56 27.7 54.7 29 54 32 C53.3 29 52 27.7 49 27 C52 26.3 53.3 25 54 22 Z" style={i(1)} />
      <path {...S} pathLength={1} className="dd" d="M60 44 C60.5 46 61.5 47 63.5 47.5 C61.5 48 60.5 49 60 51 C59.5 49 58.5 48 56.5 47.5 C58.5 47 59.5 46 60 44 Z" style={i(2)} />
    </Svg>
  );
}

/* Shop tease products (spec §7 /shop). */
export function TeeDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 72 64" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M24 8 C30 12 42 12 48 8 L64 18 L58 30 L52 26 C52 36 52.5 46 52 56 C40 59 32 59 20 56 C19.5 46 20 36 20 26 L14 30 L8 18 Z"
      />
      {/* small footprint on the chest */}
      <path
        className="ddf"
        fill="var(--color-spark)"
        d="M36 34 C33 34 31.5 37 33 40 C34 42 38 42 39 40 C40.5 37 39 34 36 34 Z M31 31.5 C31 32.5 32 33 32.8 32.6 C33.6 32.2 33.6 31 32.8 30.6 C32 30.2 31 30.6 31 31.5 Z M34.6 29.5 C34.6 30.5 35.6 31 36.4 30.6 C37.2 30.2 37.2 29 36.4 28.6 C35.6 28.2 34.6 28.6 34.6 29.5 Z M38.4 30.4 C38.4 31.4 39.4 31.9 40.2 31.5 C41 31.1 41 29.9 40.2 29.5 C39.4 29.1 38.4 29.5 38.4 30.4 Z"
      />
    </Svg>
  );
}

export function MugDoodle(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 64 56" {...p}>
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M14 16 C13.5 27 14.5 38 16 48 C26 51 36 51 44 48 C45.5 38 46.5 27 46 16 C35 14 25 14 14 16 Z"
      />
      <path {...S} pathLength={1} className="dd" d="M46 22 C58 19 59 37 46 35" style={i(1)} />
      <path {...S} pathLength={1} className="dd" d="M24 10 C21 7 25 4 22 1" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M34 10 C37 6 33 4 36 0" style={i(2)} />
    </Svg>
  );
}

/* Hand-drawn ✗ and ✓ for the /what "We don't / We do" lists. */
export function CrossMark(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 32 32" {...p}>
      <path {...S} strokeWidth={3} pathLength={1} className="dd" d="M6 6 C14 15 20 21 27 27" />
      <path {...S} strokeWidth={3} pathLength={1} className="dd" d="M27 6 C20 14 13 20 6 27" style={i(1)} />
    </Svg>
  );
}

export function CheckMark(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 32 32" {...p}>
      <path
        {...S}
        strokeWidth={3}
        pathLength={1}
        className="dd"
        d="M5 18 C10 21 12 24 14 27 C18 17 23 10 29 5"
      />
    </Svg>
  );
}
