import { ButtonLink } from "@/components/buttons";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import { getSiteSettings, getHomeSection } from "@/sanity/content";

/*
 * S8 · JOIN (spec §6-S8) — dawn paper, the two tiers side by side.
 * Tier 1: inline waitlist form. Tier 2: Founding Sapiens → Google Form.
 */
const FOUNDING_PERKS = [
  "a numbered founding membership (Founding Sapiens #001–#1000)",
  "a permanent founding badge on your future profile",
  "beta access before anyone else",
  "your name on the Founding Wall when we launch",
  "first consideration for City Saviour roles",
];

export async function S8Join() {
  const [site, hs] = await Promise.all([
    getSiteSettings(),
    getHomeSection("s8"),
  ]);
  return (
    <section id="join" className="bg-dawn py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center">{hs?.heading ?? "Be one of the first."}</h2>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2">
          {/* Tier 1 — join the movement */}
          <div className="flex flex-col items-start gap-6">
            <h3 className="font-display text-2xl font-bold">
              Join the movement
            </h3>
            <WaitlistForm source="hero" cities={site.cities} />
          </div>

          {/* Tier 2 — Founding Sapiens */}
          <div className="sketch-border flex flex-col items-start gap-5 border-2 border-ink/60 bg-paper px-8 py-9">
            <h3 className="font-display text-2xl font-bold">
              Become a Founding Sapiens
            </h3>
            <p className="text-lg italic leading-relaxed">
              The first thousand. The ones who believed before there was an
              app to believe in.
            </p>
            <p className="text-sm font-bold">Founding Sapiens receive:</p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {FOUNDING_PERKS.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
            <ButtonLink
              href={site.volunteerFormUrl}
              newTab
              title="Application link coming soon"
            >
              Apply to be a Founding Sapiens
            </ButtonLink>
            <p className="text-sm opacity-70">
              Applications are read by humans. Every single one.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
