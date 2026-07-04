import { Reveal } from "@/components/reveal";
import { CelestialJourney } from "@/components/celestial/journey";
import {
  getJourneyStages,
  getMilestones,
  getHomeSection,
  type JourneyStage,
  type Milestone,
} from "@/sanity/content";

/*
 * S6 · THE CELESTIAL JOURNEY (spec §6-S6 + §8) — night, the signature.
 * Intro line → the pinned moon→sun scrub (celestial/journey.tsx) →
 * three explainer cards. data-theme="night" inverts the header above it.
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

const FALLBACK_MILESTONES: Milestone[] = [
  { helps: 1, label: "First light", caption: "" },
  { helps: 3, label: "Kindling", caption: "" },
  { helps: 10, label: "Crescent", caption: "" },
  { helps: 50, label: "Half moon", caption: "" },
  { helps: 100, label: "Full moon", caption: "" },
  { helps: 500, label: "Sunrise", caption: "" },
  { helps: 1000, label: "Golden sun", caption: "" },
];

export async function S6Celestial() {
  const [stages, milestones, hs] = await Promise.all([
    getJourneyStages(FALLBACK_STAGES),
    getMilestones(FALLBACK_MILESTONES),
    getHomeSection("s6"),
  ]);
  return (
    <section data-theme="night" className="bg-night text-[#F7F4EC]">
      <div className="mx-auto max-w-5xl px-6 pt-28 text-center">
        <p className="font-display text-2xl font-bold text-moonlight md:text-3xl">
          {hs?.heading ??
            "On Sapiens, you don't collect followers. You collect light."}
        </p>
      </div>

      <CelestialJourney stages={stages} milestones={milestones} />

      <div className="mx-auto max-w-5xl px-6 pb-28">
        <div className="grid gap-8 md:grid-cols-3">
          {CARDS.map(({ title, body }, idx) => (
            <Reveal key={title} delay={idx * 150}>
              <div className="sketch-border h-full border-2 border-moonlight/40 px-7 py-8 text-center">
                <h3 className="font-display text-2xl font-bold text-gold">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-moonlight">
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
