/*
 * Hand-drawn marquee strip at the hero's bottom edge (spec §6-S1): slow
 * continuous scroll, Cabin Sketch, items separated by sparkle doodles.
 * Items come from lib/site.ts (CMS-editable in stage 4). The track is
 * rendered twice so the loop is seamless; the copy is aria-labelled once.
 */
import { site } from "@/lib/site";

function Sparkle() {
  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4 shrink-0 text-spark" aria-hidden>
      <path
        fill="currentColor"
        d="M16 3 C17 10 19 14 27 16 C19 18 17 22 16 29 C15 22 13 18 5 16 C13 14 15 10 16 3 Z"
      />
    </svg>
  );
}

function Track() {
  return (
    <>
      {site.marqueeItems.map((item) => (
        <span key={item} className="flex items-center gap-8">
          <span className="font-display text-lg font-bold whitespace-nowrap">
            {item}
          </span>
          <Sparkle />
        </span>
      ))}
    </>
  );
}

export function Marquee() {
  return (
    <div
      className="marquee border-y-2 border-ink/15 py-3"
      role="marquee"
      aria-label={site.marqueeItems.join(" · ")}
    >
      <div className="marquee-track flex items-center gap-8">
        <Track />
        <span aria-hidden className="flex items-center gap-8">
          <Track />
        </span>
      </div>
    </div>
  );
}
