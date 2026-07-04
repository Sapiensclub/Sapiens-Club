import Image from "next/image";
import { ButtonLink } from "@/components/buttons";
import { LogoMark } from "@/components/logo";
import { ArrowCurved } from "@/components/doodles/basics";
import { getMinimalHero } from "@/sanity/content";

/*
 * S0 · MINIMAL HERO (owner request, July 2026): the first thing visitors
 * see. Calm and clean, Anthropic-style — logo + wordmark centered in open
 * warm-paper space filling the first screen, one CTA, a scroll cue.
 * Wordmark, tagline, button label and (optionally) the logo image are
 * editable in the studio ("Minimal hero"). The living-doodle hero sits
 * directly below, unchanged.
 */
export async function S0MinimalHero() {
  const hero = await getMinimalHero();
  return (
    <section className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-7 px-6 text-center">
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
        <LogoMark
          className="h-32 w-auto md:h-44"
          title={`${hero.wordmark} footprint logo`}
        />
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 rotate-90"
      >
        <ArrowCurved className="w-10 text-ink/60" />
      </a>
    </section>
  );
}
