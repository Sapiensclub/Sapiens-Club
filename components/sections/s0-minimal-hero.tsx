import Image from "next/image";
import { ButtonLink } from "@/components/buttons";
import { LogoAnimated } from "@/components/logo-animated";
import { ArrowCurved } from "@/components/doodles/basics";
import { FootprintTrail } from "@/components/hero/FootprintTrail";
import { getMinimalHero, getSiteSettings } from "@/sanity/content";

/*
 * S0 · MINIMAL HERO (owner request, July 2026): the first thing visitors
 * see. Calm and clean, Anthropic-style — logo + wordmark centered in open
 * warm-paper space filling the first screen, one CTA, a scroll cue.
 * Wordmark, tagline, button label and (optionally) the logo image are
 * editable in the studio ("Minimal hero"). The living-doodle hero sits
 * directly below, unchanged.
 */
export async function S0MinimalHero() {
  const [hero, site] = await Promise.all([getMinimalHero(), getSiteSettings()]);
  return (
    /* `isolate` contains the footprint effect's -z-10 canvas to this hero */
    <section className="relative isolate flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-7 px-6 text-center">
      <FootprintTrail variant="night" enabled={site.footprintEffectEnabled} />
      {hero.logoUrl && hero.logoWidth && hero.logoHeight ? (
        <Image
          src={hero.logoUrl}
          alt={`${hero.wordmark} logo`}
          width={Math.round(hero.logoWidth)}
          height={Math.round(hero.logoHeight)}
          priority
          className="h-32 w-auto md:h-44"
        />
      ) : (
        /* the once-per-session footprint intro animation (spec §3) lives
           here now — the first thing a visitor sees, playing on load */
        <LogoAnimated className="h-32 w-auto md:h-44" />
      )}

      <p className="font-display text-6xl font-bold tracking-wide md:text-7xl">
        {hero.wordmark}
      </p>

      {hero.tagline && (
        <p className="max-w-md text-lg leading-relaxed opacity-80">
          {hero.tagline}
        </p>
      )}

      <ButtonLink href="#join" className="mt-2">
        {hero.ctaLabel}
      </ButtonLink>

      <a
        href="#world"
        aria-label="Scroll to see more"
        className="bob-cue absolute bottom-6 left-1/2 -translate-x-1/2 rotate-90"
      >
        <ArrowCurved className="w-10 text-ink/60" />
      </a>
    </section>
  );
}
