/*
 * Doodle SVG library, part 2 — scene vignettes (spec §2.3).
 * Same conventions as basics.tsx. These are the little "moments" that give
 * the site its life: sharing an umbrella, passing a tiffin, a high-five,
 * the S2 back-to-back/facing swap pair, and the two doors of S3.
 * Their loop animations (rain falling, bobbing) come in build stage 6 —
 * here they draw themselves in and hold their final pose.
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

/* Two figures sharing an umbrella while rain falls outside it. */
export function UmbrellaShare(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 120 96" {...p}>
      {/* canopy */}
      <path {...S} pathLength={1} className="dd" d="M16 42 C28 16 88 16 98 42" />
      <path
        {...S}
        pathLength={1}
        className="dd"
        d="M16 42 C24 36 32 36 40 42 C48 36 56 36 64 42 C72 36 80 36 88 42 C92 39 95 40 98 42"
        style={i(1)}
      />
      {/* pole + hook */}
      <path {...S} pathLength={1} className="dd" d="M57 30 L57 78 C57 84 63 84 63 80" style={i(2)} />
      {/* two figures */}
      <circle {...S} pathLength={1} className="dd" cx="44" cy="58" r="6" style={i(3)} />
      <path {...S} pathLength={1} className="dd" d="M44 64 C43 74 43 80 44 88" style={i(3)} />
      <circle {...S} pathLength={1} className="dd" cx="72" cy="58" r="6" style={i(4)} />
      <path {...S} pathLength={1} className="dd" d="M72 64 C73 74 73 80 72 88" style={i(4)} />
      {/* rain, outside the canopy */}
      <path {...S} pathLength={1} className="dd rain" d="M8 20 L5 28" style={i(5)} />
      <path {...S} pathLength={1} className="dd rain" d="M112 24 L109 32" style={i(5)} />
      <path {...S} pathLength={1} className="dd rain" d="M103 8 L100 16" style={i(5)} />
    </Svg>
  );
}

/* A tiffin passed hand-to-hand, steam rising, sparkle at the handoff. */
export function TiffinPass(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 120 80" {...p}>
      {/* arms reaching in from both edges */}
      <path {...S} pathLength={1} className="dd" d="M4 52 C20 46 32 45 46 48" />
      <path {...S} pathLength={1} className="dd" d="M116 56 C100 52 90 51 78 49" style={i(1)} />
      {/* tiffin: two stacked tins + handle */}
      <path {...S} pathLength={1} className="dd" d="M50 38 L74 38 L73 46 C65 48 58 48 51 46 Z" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M51 48 L73 48 L72 56 C65 58 59 58 52 56 Z" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M56 37 C56 29 68 29 68 37" style={i(3)} />
      {/* steam */}
      <path {...S} pathLength={1} className="dd" d="M58 24 C55 20 61 16 58 11" style={i(4)} />
      <path {...S} pathLength={1} className="dd" d="M66 24 C69 19 63 15 66 10" style={i(4)} />
      {/* sparkle on the handoff */}
      <path
        className="ddf"
        fill="var(--color-spark)"
        d="M44 56 C44.7 59 46 60.3 49 61 C46 61.7 44.7 63 44 66 C43.3 63 42 61.7 39 61 C42 60.3 43.3 59 44 56 Z"
      />
    </Svg>
  );
}

/* Two figures mid high-five, spark burst at the contact point. */
export function HighFive(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 120 96" {...p}>
      {/* left figure */}
      <circle {...S} pathLength={1} className="dd" cx="34" cy="30" r="7" />
      <path {...S} pathLength={1} className="dd" d="M34 38 C32 52 32 62 33 78" />
      <path {...S} pathLength={1} className="dd" d="M33 78 L26 92 M33 78 L40 92" style={i(1)} />
      <path {...S} pathLength={1} className="dd" d="M34 44 C42 40 50 34 56 26" style={i(1)} />
      {/* right figure */}
      <circle {...S} pathLength={1} className="dd" cx="86" cy="30" r="7" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M86 38 C88 52 88 62 87 78" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M87 78 L80 92 M87 78 L94 92" style={i(3)} />
      <path {...S} pathLength={1} className="dd" d="M86 44 C78 40 70 34 64 26" style={i(3)} />
      {/* spark burst where the hands meet */}
      <g className="ddf" stroke="var(--color-spark)" strokeWidth={2.5} strokeLinecap="round">
        <path d="M60 14 L60 7" />
        <path d="M51 17 L46 12" />
        <path d="M69 17 L74 12" />
        <path d="M56 22 L53 19" />
        <path d="M64 22 L67 19" />
      </g>
    </Svg>
  );
}

/*
 * S2 swap pair: back-to-back on phones → facing each other.
 * The section crossfades between these two at its midpoint (stage 6).
 */
export function PeopleBackToBack(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 120 96" {...p}>
      {/* left figure, hunched over a phone */}
      <circle {...S} pathLength={1} className="dd" cx="44" cy="32" r="7" />
      <path {...S} pathLength={1} className="dd" d="M44 40 C38 48 36 60 38 78" />
      <path {...S} pathLength={1} className="dd" d="M38 78 L32 92 M38 78 L44 92" style={i(1)} />
      <path {...S} pathLength={1} className="dd" d="M42 48 C36 50 32 54 30 58" style={i(1)} />
      <path {...S} pathLength={1} className="dd" d="M24 56 L32 60 L29 68 L21 64 Z" style={i(2)} />
      {/* right figure, mirrored */}
      <circle {...S} pathLength={1} className="dd" cx="76" cy="32" r="7" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M76 40 C82 48 84 60 82 78" style={i(3)} />
      <path {...S} pathLength={1} className="dd" d="M82 78 L76 92 M82 78 L88 92" style={i(3)} />
      <path {...S} pathLength={1} className="dd" d="M78 48 C84 50 88 54 90 58" style={i(4)} />
      <path {...S} pathLength={1} className="dd" d="M96 56 L88 60 L91 68 L99 64 Z" style={i(4)} />
    </Svg>
  );
}

export function PeopleFacing(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 120 96" {...p}>
      {/* left figure, turned toward the other */}
      <circle {...S} pathLength={1} className="dd" cx="44" cy="30" r="7" />
      <path {...S} pathLength={1} className="dd" d="M44 38 C44 52 44 64 43 78" />
      <path {...S} pathLength={1} className="dd" d="M43 78 L37 92 M43 78 L49 92" style={i(1)} />
      <path {...S} pathLength={1} className="dd" d="M44 46 C52 48 58 50 59 54" style={i(1)} />
      {/* right figure */}
      <circle {...S} pathLength={1} className="dd" cx="76" cy="30" r="7" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M76 38 C76 52 76 64 77 78" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M77 78 L71 92 M77 78 L83 92" style={i(3)} />
      <path {...S} pathLength={1} className="dd" d="M76 46 C68 48 62 50 61 54" style={i(3)} />
      {/* small heart between them */}
      <path
        className="ddf"
        fill="var(--color-spark)"
        d="M60 44 C55.5 40.5 54 37.5 55.5 35.5 C57 33.8 59.5 34.5 60 36.5 C60.5 34.5 63 33.8 64.5 35.5 C66 37.5 64.5 40.5 60 44 Z"
      />
    </Svg>
  );
}

/*
 * S3 door pair. Hover "cracks the door open with spark light spilling out"
 * — the .door-light layer is revealed by CSS (stage 6 wires the hover).
 */
export function DoorA(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 72 104" {...p}>
      <path className="door-light" fill="var(--color-spark)" opacity="0" d="M14 96 L14 14 C30 10 44 10 60 14 L60 96 Z" />
      <path {...S} pathLength={1} className="dd" d="M10 98 L12 10 C28 6 46 6 62 10 L62 98" />
      <path {...S} pathLength={1} className="dd" d="M22 88 L23 24 C32 22 42 22 52 24 L52 88" style={i(1)} />
      <circle {...S} pathLength={1} className="dd" cx="48" cy="58" r="2.5" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M2 98 L70 98" style={i(2)} />
    </Svg>
  );
}

export function DoorB(p: DoodleProps) {
  return (
    <Svg viewBox="0 0 72 104" {...p}>
      <path className="door-light" fill="var(--color-spark)" opacity="0" d="M14 96 L14 36 C16 16 58 16 60 36 L60 96 Z" />
      <path {...S} pathLength={1} className="dd" d="M10 98 L11 34 C12 12 60 12 61 34 L62 98" />
      <path {...S} pathLength={1} className="dd" d="M22 88 L22 40 C24 26 48 26 50 40 L50 88" style={i(1)} />
      <circle {...S} pathLength={1} className="dd" cx="27" cy="60" r="2.5" style={i(2)} />
      <path {...S} pathLength={1} className="dd" d="M2 98 L70 98" style={i(2)} />
    </Svg>
  );
}
