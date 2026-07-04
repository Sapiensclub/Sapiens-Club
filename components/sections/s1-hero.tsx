import { LogoAnimated } from "@/components/logo-animated";
import { ButtonLink } from "@/components/buttons";
import { Marquee } from "@/components/marquee";
import { Doodle } from "@/components/doodles/doodle";
import {
  CloudA,
  CloudB,
  CloudC,
  ArrowCurved,
  PaperPlane,
} from "@/components/doodles/basics";
import {
  UmbrellaShare,
  TiffinPass,
  HighFive,
} from "@/components/doodles/vignettes";
import { site } from "@/lib/site";

/*
 * S1 · HERO — "The Living Doodle World" (spec §6-S1).
 * Stage 3 = content + layout with the doodles drawing themselves in.
 * Stage 6 adds: vignette loops (rain, steam, bobbing), the flying paper
 * plane, cloud drift, mouse parallax, per-word headline stroke-draw.
 */
export function S1Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-64px)] flex-col overflow-hidden">
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-14">
        {/* headline block, center-left on desktop */}
        <div className="relative z-10 flex max-w-2xl flex-col items-start gap-6 lg:w-[60%]">
          <LogoAnimated className="h-28 w-auto md:h-36" />
          <h1>
            A society where{" "}
            <span className="relative inline-block">
              helping
              {/* hand-drawn spark circle scribbled around the word */}
              <svg
                viewBox="0 0 120 60"
                preserveAspectRatio="none"
                className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+24px)] text-spark"
                aria-hidden
              >
                <path
                  d="M8 30 C10 12 40 4 62 6 C92 8 114 16 112 32 C110 48 78 56 52 54 C24 52 6 44 8 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            each other is the default — not the exception.
          </h1>
          <p className="text-lg leading-relaxed">
            Sapiens is a community where real people help real people —
            offline, nearby, for nothing in return. Someone near you needs a
            hand right now. Someone near you is ready to give one.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink href="#join">Join the movement</ButtonLink>
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

          {/* mobile: the two vignettes live in the flow, never over text
              (spec §6-S1: vignettes reduce to 2 on mobile) */}
          <div className="flex w-full items-end justify-center gap-12 pt-6 md:hidden">
            <Doodle className="block w-28 text-ink">
              <UmbrellaShare title="Two people sharing an umbrella in the rain" />
            </Doodle>
            <Doodle className="block w-28 text-ink" delay={400}>
              <HighFive title="Two people high-fiving" />
            </Doodle>
          </div>
        </div>

        {/* the living doodle world around the edges */}
        <Doodle className="absolute top-8 right-[8%] hidden w-40 text-ink md:block" delay={200}>
          <UmbrellaShare title="Two people sharing an umbrella in the rain" />
        </Doodle>
        <Doodle className="absolute right-[4%] bottom-[30%] hidden w-40 text-ink lg:block" delay={600}>
          <HighFive title="Two people high-fiving" />
        </Doodle>
        <Doodle className="absolute right-[28%] bottom-8 hidden w-36 text-ink md:block" delay={1000}>
          <TiffinPass title="A tiffin passed from one hand to another" />
        </Doodle>
        <Doodle className="absolute top-10 left-[42%] hidden w-20 opacity-50 lg:block">
          <CloudA />
        </Doodle>
        <Doodle className="absolute top-[38%] right-[18%] hidden w-14 opacity-40 md:block" delay={400}>
          <CloudB />
        </Doodle>
        <Doodle className="absolute bottom-[18%] left-[2%] hidden w-12 opacity-40 xl:block" delay={800}>
          <CloudC />
        </Doodle>
        <Doodle className="absolute top-[16%] right-[30%] hidden w-14 rotate-12 lg:block" delay={1200}>
          <PaperPlane title="A paper plane" />
        </Doodle>

        {/* scroll cue */}
        <a
          href="#ache"
          aria-label="Scroll to the next section"
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 rotate-90 md:block"
        >
          <ArrowCurved className="w-10 text-ink/70" />
        </a>
      </div>

      {/* marquee strip at the hero's bottom edge */}
      <Marquee />
    </section>
  );
}
