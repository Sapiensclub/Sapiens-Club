import { Doodle } from "@/components/doodles/doodle";
import { MoonDoodle } from "@/components/doodles/extras";
import {
  getJourneyStages,
  getHomeSection,
  type JourneyStage,
} from "@/sanity/content";

/*
 * S6 · THE CELESTIAL JOURNEY (spec §6-S6 + §8) — night, the signature.
 *
 * Stage 3 = static night section: intro line, a moon visual, the milestone
 * ladder, and the three explainer cards. Stage 7 replaces the middle with
 * the full GSAP pinned scrub (moon phases 0→1000 helps, HUD, galaxy
 * finale) and the day→night background choreography.
 *
 * data-theme="night" makes the header invert while this section is under it.
 */
const CARDS = [
  {
    title: "Moneta",
    body: "One for every completed help. Earned, never bought. One day you'll spend it on good things — but its real value is what it says about you.",
  },
  {
    title: "Goodness Meter",
    body: "A gentle 0-to-100 reflection of your helping life — how often, how varied, how kind.",
  },
  {
    title: "Milestones",
    body: "At 1, 3, 10, 50, 100, 500 and 1000 helps, the people you've connected with celebrate with you.",
  },
];

const FALLBACK_STAGES: JourneyStage[] = [
  { threshold: 0, name: "New moon", caption: "Your journey begins" },
  { threshold: 10, name: "Crescent", caption: "Your light is growing" },
  { threshold: 50, name: "Half moon", caption: "Halfway to full" },
  { threshold: 100, name: "Full moon", caption: "You light the way for others" },
  { threshold: 500, name: "Sunrise", caption: "Your warmth starts to spread" },
  { threshold: 1000, name: "Golden sun", caption: "Your light joins the galaxy." },
];

export async function S6Celestial() {
  const [stages, hs] = await Promise.all([
    getJourneyStages(FALLBACK_STAGES),
    getHomeSection("s6"),
  ]);
  const first = stages[0];
  const ladder = stages.slice(1); // stage 0 (new moon) captions the moon itself
  return (
    // hardcoded light text — this section is night-coloured in both themes
    <section data-theme="night" className="bg-night py-28 text-[#F7F4EC]">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="font-display text-2xl font-bold text-moonlight md:text-3xl">
          {hs?.heading ??
            "On Sapiens, you don't collect followers. You collect light."}
        </p>

        <Doodle className="mx-auto mt-14 block w-32 text-moonlight">
          <MoonDoodle title="A crescent moon with two stars" />
        </Doodle>
        <p className="mt-4 text-sm tracking-wide text-moonlight/80">
          {first?.caption ?? "Your journey begins"}
        </p>

        {/* milestone ladder — becomes the scroll-driven scrub in stage 7 */}
        <ol
          className="mx-auto mt-12 grid max-w-3xl gap-4 text-left sm:[grid-template-columns:repeat(var(--n),minmax(0,1fr))] sm:text-center"
          style={{ "--n": ladder.length } as React.CSSProperties}
        >
          {ladder.map(({ name, threshold, caption }) => (
            <li key={name} className="flex flex-col gap-1">
              <span
                aria-hidden
                className="mx-0 h-2.5 w-2.5 rounded-full bg-gold sm:mx-auto"
              />
              <span className="font-display text-lg font-bold text-gold">
                {name}
              </span>
              <span className="text-xs text-moonlight/70">
                {threshold} helps
              </span>
              <span className="text-xs text-moonlight/90">{caption}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-lg italic text-moonlight">
          Individually we glow. Together, we are a galaxy.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {CARDS.map(({ title, body }) => (
            <div
              key={title}
              className="sketch-border border-2 border-moonlight/40 px-7 py-8 text-center"
            >
              <h3 className="font-display text-2xl font-bold text-gold">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-moonlight">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
