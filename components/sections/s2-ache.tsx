import { Reveal } from "@/components/reveal";
import { AcheFigures } from "./s2-figures";
import { getHomeSection } from "@/sanity/content";

/*
 * S2 · THE ACHE (spec §6-S2) — quiet contrast; motion nearly stops.
 * No statistic, purely emotional. The three lines fade in one at a time;
 * the figures turn to face each other at the section's midpoint.
 */
const LINES = [
  "Everything is one tap away — food, rides, entertainment. Everything except each other.",
  "We pass a hundred people a day and know none of them.",
  "And when money decides who gets help, kindness becomes a luxury.",
];

export async function S2Ache() {
  const hs = await getHomeSection("s2");
  return (
    <section id="ache" className="mx-auto max-w-3xl px-6 py-28 text-center">
      <h2>
        {hs?.heading ??
          "We have never been more connected. And never more alone."}
      </h2>
      <div className="mt-14 space-y-10">
        {LINES.map((line, idx) => (
          <Reveal key={line} delay={idx * 250}>
            <p className="text-lg leading-relaxed md:text-xl">{line}</p>
          </Reveal>
        ))}
      </div>
      <AcheFigures />
    </section>
  );
}
