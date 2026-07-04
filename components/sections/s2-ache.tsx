import { Doodle } from "@/components/doodles/doodle";
import { PeopleBackToBack } from "@/components/doodles/vignettes";

/*
 * S2 · THE ACHE (spec §6-S2) — quiet contrast; motion nearly stops.
 * No statistic, purely emotional. Stage 6 adds: lines fading in one at a
 * time on scroll, and the back-to-back figures crossfading to the facing
 * pose at the section's midpoint (that turn IS the emotional beat).
 */
const LINES = [
  "Everything is one tap away — food, rides, entertainment. Everything except each other.",
  "We pass a hundred people a day and know none of them.",
  "And when money decides who gets help, kindness becomes a luxury.",
];

export function S2Ache() {
  return (
    <section id="ache" className="mx-auto max-w-3xl px-6 py-28 text-center">
      <h2>We have never been more connected. And never more alone.</h2>
      <div className="mt-14 space-y-10">
        {LINES.map((line) => (
          <p key={line} className="text-lg leading-relaxed md:text-xl">
            {line}
          </p>
        ))}
      </div>
      <Doodle className="mx-auto mt-16 w-48 text-ink">
        <PeopleBackToBack title="Two people back to back, each looking at a phone" />
      </Doodle>
    </section>
  );
}
