import { LogoAnimated } from "@/components/logo-animated";
import { ButtonLink } from "@/components/buttons";
import { site } from "@/lib/site";

/*
 * Temporary placeholder home page — replaced by the full S1–S9 homepage in
 * build-order stage 3. Exists so sapiens.club can go live on Vercel early,
 * and to exercise the stage-2 components (logo intro, buttons).
 */
export default function Home() {
  return (
    <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <LogoAnimated className="h-40 w-auto md:h-52" />
      <h1 className="max-w-3xl">
        A society where <span className="text-spark">helping</span> each other
        is the default — not the exception.
      </h1>
      <p className="max-w-xl text-lg leading-relaxed">
        Sapiens is a community where real people help real people — offline,
        nearby, for nothing in return.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-5">
        <ButtonLink href="/club">Join the movement</ButtonLink>
        <ButtonLink
          href={site.volunteerFormUrl}
          variant="secondary"
          title="Application link coming soon"
        >
          Become a founding volunteer
        </ButtonLink>
      </div>
      <p className="text-sm font-semibold tracking-wide">
        Launching in India, 2026. No app needed yet — just belief.
      </p>
    </section>
  );
}
