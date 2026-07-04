import { ButtonLink } from "@/components/buttons";
import { getHomeSection } from "@/sanity/content";

/*
 * S7 · THE MOVEMENT (spec §6-S7) — dawn begins. Mentions City Saviours
 * only as a "later" thing, per the vocabulary rules.
 */
export async function S7Movement() {
  const hs = await getHomeSection("s7");
  return (
    <section className="s7-movement bg-gradient-to-b from-[#4A3F63] via-[#C9A98E] to-dawn py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {/* hardcoded light — this text sits on a dusk gradient in both themes */}
        <h2 className="text-[#F7F4EC] [text-shadow:0_1px_12px_rgba(23,20,46,0.35)]">
          {hs?.heading ?? "This is bigger than an app."}
        </h2>
        <p className="mt-8 text-lg leading-relaxed text-[#F7F4EC] [text-shadow:0_1px_10px_rgba(23,20,46,0.45)]">
          Every month, each city will name its most generous Sapiens. The best
          of them become City Saviours — people whose full-time work is
          helping, supported by the community. When two Sapiens both give five
          stars, they can capture the moment together — the deed is the story,
          not the selfie. Milestones ripple out to everyone you&apos;ve helped.
          Goodness, made visible.
        </p>

        {/* organizations ribbon */}
        <div className="sketch-border mt-16 border-2 border-ink/70 bg-paper/90 px-8 py-8">
          <p className="text-lg font-semibold">
            A campus? A company? A housing society? Bring Sapiens to your
            community first.
          </p>
          <ButtonLink
            href="/club#organizations"
            variant="secondary"
            className="mt-5"
          >
            For organizations
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
