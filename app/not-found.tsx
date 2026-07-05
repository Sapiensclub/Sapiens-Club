import { ButtonLink } from "@/components/buttons";
import { Doodle } from "@/components/doodles/doodle";
import { CloudB, PaperPlane } from "@/components/doodles/basics";

/*
 * Branded 404 (QA stage 9) — a lost paper plane, a way home.
 */
export default function NotFound() {
  return (
    <section className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-7 px-6 py-24 text-center">
      <Doodle className="block w-24 rotate-[24deg] text-ink">
        <PaperPlane title="A paper plane, slightly lost" />
      </Doodle>
      <h1>This page wandered off.</h1>
      <p className="max-w-md text-lg leading-relaxed">
        Even paper planes lose their way sometimes. The rest of Sapiens is
        exactly where you left it.
      </p>
      <ButtonLink href="/">Take me home</ButtonLink>
      <Doodle className="absolute top-12 right-8 block w-16 opacity-40">
        <CloudB />
      </Doodle>
    </section>
  );
}
