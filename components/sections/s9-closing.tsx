import { ButtonLink } from "@/components/buttons";
import { Doodle } from "@/components/doodles/doodle";
import { SunriseDoodle } from "@/components/doodles/extras";
import { Reveal } from "@/components/reveal";
import { getHomeSection } from "@/sanity/content";

/*
 * S9 · CLOSING (spec §6-S9) — full-width dawn moment before the footer.
 */
export async function S9Closing() {
  const hs = await getHomeSection("s9");
  return (
    <section className="bg-dawn px-6 pt-10 pb-28 text-center">
      <Doodle className="mx-auto block w-56 text-ink">
        <SunriseDoodle title="The sun rising over the horizon" />
      </Doodle>
      <Reveal>
        <h2 className="mx-auto mt-8 max-w-2xl">
          {hs?.heading ?? "The sun rises one act of kindness at a time."}
        </h2>
        <div className="mt-10">
          <ButtonLink href="#join">Join the movement</ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
