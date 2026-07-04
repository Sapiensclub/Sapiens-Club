import { Doodle } from "@/components/doodles/doodle";
import { ArrowCurved, ShieldDoodle } from "@/components/doodles/basics";
import { TiffinPass } from "@/components/doodles/vignettes";

/*
 * S5 · REAL MOMENTS (spec §6-S5) — dusk. Honesty is non-negotiable: these
 * are illustrative stories, never presented as testimonials.
 *
 * Stage 4 moves these cards into the CMS (`story` schema).
 * PHASE 2 NOTE: this section swaps to real stories + interview video
 * embeds once the app is live; the schema already supports `videoUrl`.
 */
const STORIES = [
  {
    title: "The ride",
    body: "The cab cancelled twice. His appointment was in twenty minutes. He pressed Help — and a neighbour he'd never met, already heading that way, said “come along.” They talked the whole ride.",
    Art: ArrowCurved,
  },
  {
    title: "Friday night dinner",
    body: "Jessica, 45, lives alone in Mumbai. That Friday the pain was too much to cook through. She pressed Help. Three homes nearby had extra food from a party. Her neighbour from the park — the one she'd only ever said hello to — walked it over, warm.",
    Art: TiffinPass,
  },
  {
    title: "The parking lot",
    body: "Late night, Anna noticed two men following her. She pressed SOS. Every Sapiens within reach was alerted, and so were the police. Strangers arrived in minutes. She never learned their names — Sapiens doesn't work that way. She didn't need to.",
    Art: ShieldDoodle,
  },
];

export function S5Moments() {
  return (
    <section className="s5-moments bg-gradient-to-b from-paper via-[#EFE6E4] to-[#4A3F63] py-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2>Stories from the world we&apos;re building</h2>
        <p className="mt-4 text-lg">
          The app isn&apos;t live yet. These are the moments it exists to
          create.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {STORIES.map(({ title, body, Art }, idx) => (
            <article
              key={title}
              className="sketch-border flex flex-col items-center gap-5 border-2 border-ink/40 bg-paper px-7 py-9 text-center"
            >
              <Doodle className="h-16 w-20 text-ink" delay={idx * 200}>
                <Art className="h-full w-full" />
              </Doodle>
              <h3 className="font-display text-2xl font-bold">{title}</h3>
              <p className="text-sm leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
