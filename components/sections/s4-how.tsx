import Link from "next/link";
import { Doodle } from "@/components/doodles/doodle";
import {
  PaperPlane,
  SparkleA,
  HeartDoodle,
  ShieldDoodle,
} from "@/components/doodles/basics";
import { PeopleFacing, HighFive } from "@/components/doodles/vignettes";

/*
 * S4 · HOW IT WORKS (spec §6-S4). Five cards — horizontal scroll-snap on
 * desktop, vertical stack on mobile — plus the safety strip.
 */
const STEPS = [
  {
    title: "Ask.",
    body: "Raise a request — a ride, a meal, a game of badminton, a helping hand.",
    Art: PaperPlane,
  },
  {
    title: "Nearby Sapiens are pinged.",
    body: "Only people who chose to help with exactly this. No broadcasting, no noise.",
    Art: SparkleA,
  },
  {
    title: "Someone shows up.",
    body: "Photo-verified, like your cab app. You always know who's coming.",
    Art: PeopleFacing,
  },
  {
    title: "Help happens. Moneta is earned.",
    body: "Our token of goodness. Earned, never bought. No money changes hands. Ever.",
    Art: HighFive,
  },
  {
    title: "You choose to connect.",
    body: "If you both want to, a real friendship begins — founded on a real act.",
    Art: HeartDoodle,
  },
];

const SAFETY = [
  "Government-ID verification before anyone helps or is helped",
  "Photo check at every meetup",
  "Ratings and a complaint system",
  "A separate, group-only mode for under-18s",
  "An SOS button connected to nearby Sapiens and local police",
];

export function S4How() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center">Five steps. Zero rupees.</h2>

        <ol className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 max-md:flex-col max-md:overflow-visible md:[&>li]:min-w-[260px]">
          {STEPS.map(({ title, body, Art }, idx) => (
            <li
              key={title}
              className="sketch-border flex flex-1 snap-start flex-col items-center gap-4 border-2 border-ink/60 px-6 py-8 text-center"
            >
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-full bg-spark font-display text-xl font-bold text-night"
              >
                {idx + 1}
              </span>
              <Doodle className="h-20 w-24 text-ink" delay={idx * 150}>
                <Art className="h-full w-full" />
              </Doodle>
              <h3 className="font-display text-xl font-bold">{title}</h3>
              <p className="text-sm leading-relaxed">{body}</p>
            </li>
          ))}
        </ol>

        {/* safety strip */}
        <div className="sketch-border mt-12 border-2 border-ink/60 bg-dawn px-8 py-8">
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">
            <Doodle className="w-14 shrink-0 text-ink">
              <ShieldDoodle title="A hand-drawn shield" />
            </Doodle>
            <ul className="grid gap-x-8 gap-y-2 text-sm font-semibold sm:grid-cols-2">
              {SAFETY.map((line) => (
                <li key={line}>
                  <Link href="/how" className="hover:text-clay">
                    {line}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-5 font-display text-xl font-bold">
            Trust isn&apos;t a feature. It&apos;s the whole point.
          </p>
        </div>
      </div>
    </section>
  );
}
