import { Doodle } from "@/components/doodles/doodle";
import { DoorA, DoorB } from "@/components/doodles/vignettes";

/*
 * S3 · THE IDEA (spec §6-S3) — two doors. Hover: the door cracks open with
 * spark light spilling out (simple CSS reveal now; richer in stage 6).
 */
const DOORS = [
  {
    Door: DoorA,
    title: "I need a hand",
    body: "A ride. A meal. A skill. A teammate. Ask, and nearby Sapiens are quietly notified.",
    alt: "A hand-drawn door, slightly open",
  },
  {
    Door: DoorB,
    title: "I want to help",
    body: "Tell us how you like to help. When someone nearby needs exactly that, you'll know.",
    alt: "A hand-drawn arched door",
  },
];

export function S3Idea() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-28 text-center">
      <h2>The anti-social-network. Built for real life.</h2>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
        No profiles to scroll. No feeds to get lost in. No money changing
        hands. You open Sapiens for one of two reasons:
      </p>

      <div className="mt-14 grid gap-8 sm:grid-cols-2">
        {DOORS.map(({ Door, title, body, alt }) => (
          <div
            key={title}
            className="door-card sketch-border flex flex-col items-center gap-5 border-2 border-ink/60 px-8 py-10"
          >
            <Doodle className="w-20 text-ink">
              <Door title={alt} />
            </Doodle>
            <h3 className="font-display text-2xl font-bold">{title}</h3>
            <p className="leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-14 max-w-2xl text-lg italic leading-relaxed">
        When A helps B, they may never meet again. But someday, Z will help B.
        That is how a society learns to trust itself.
      </p>
    </section>
  );
}
