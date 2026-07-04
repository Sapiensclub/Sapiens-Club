import { Doodle } from "@/components/doodles/doodle";
import {
  ArrowCurved,
  ShieldDoodle,
  HeartDoodle,
  PaperPlane,
} from "@/components/doodles/basics";
import {
  TiffinPass,
  UmbrellaShare,
  HighFive,
} from "@/components/doodles/vignettes";
import { getStories, getHomeSection, type Story } from "@/sanity/content";

/*
 * S5 · REAL MOMENTS (spec §6-S5) — dusk. Honesty is non-negotiable: these
 * are illustrative stories, never presented as testimonials.
 *
 * Stage 4 moves these cards into the CMS (`story` schema).
 * PHASE 2 NOTE: this section swaps to real stories + interview video
 * embeds once the app is live; the schema already supports `videoUrl`.
 */
const FALLBACK_STORIES: Story[] = [
  {
    title: "The ride",
    body: "The cab cancelled twice. His appointment was in twenty minutes. He pressed Help — and a neighbour he'd never met, already heading that way, said “come along.” They talked the whole ride.",
    doodleKey: "ride",
  },
  {
    title: "Friday night dinner",
    body: "Jessica, 45, lives alone in Mumbai. That Friday the pain was too much to cook through. She pressed Help. Three homes nearby had extra food from a party. Her neighbour from the park — the one she'd only ever said hello to — walked it over, warm.",
    doodleKey: "tiffin",
  },
  {
    title: "The parking lot",
    body: "Late night, Anna noticed two men following her. She pressed SOS. Every Sapiens within reach was alerted, and so were the police. Strangers arrived in minutes. She never learned their names — Sapiens doesn't work that way. She didn't need to.",
    doodleKey: "shield",
  },
];

const DOODLES: Record<string, React.ComponentType<{ className?: string }>> = {
  ride: ArrowCurved,
  tiffin: TiffinPass,
  shield: ShieldDoodle,
  umbrella: UmbrellaShare,
  highfive: HighFive,
  heart: HeartDoodle,
  plane: PaperPlane,
};

export async function S5Moments() {
  const [stories, hs] = await Promise.all([
    getStories(FALLBACK_STORIES),
    getHomeSection("s5"),
  ]);
  return (
    <section className="s5-moments bg-gradient-to-b from-paper via-[#EFE6E4] to-[#4A3F63] py-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2>{hs?.heading ?? "Stories from the world we're building"}</h2>
        <p className="mt-4 text-lg">
          {hs?.subheading ??
            "The app isn't live yet. These are the moments it exists to create."}
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {stories.map(({ title, body, doodleKey }, idx) => {
            const Art = DOODLES[doodleKey] ?? HeartDoodle;
            return (
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
