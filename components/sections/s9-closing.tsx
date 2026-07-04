import { ButtonLink } from "@/components/buttons";
import { Doodle } from "@/components/doodles/doodle";
import { SunriseDoodle } from "@/components/doodles/extras";

/*
 * S9 · CLOSING (spec §6-S9) — full-width dawn moment before the footer.
 */
export function S9Closing() {
  return (
    <section className="bg-dawn px-6 pt-10 pb-28 text-center">
      <Doodle className="mx-auto w-56 text-ink">
        <SunriseDoodle title="The sun rising over the horizon" />
      </Doodle>
      <h2 className="mx-auto mt-8 max-w-2xl">
        The sun rises one act of kindness at a time.
      </h2>
      <div className="mt-10">
        <ButtonLink href="#join">Join the movement</ButtonLink>
      </div>
    </section>
  );
}
