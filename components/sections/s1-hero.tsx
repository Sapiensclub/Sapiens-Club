import { LogoAnimated } from "@/components/logo-animated";
import { ButtonLink } from "@/components/buttons";
import { Marquee } from "@/components/marquee";
import { Doodle } from "@/components/doodles/doodle";
import { InViewClass } from "@/components/reveal";
import { HeroParallax } from "@/components/hero-parallax";
import {
  CloudA,
  CloudB,
  CloudC,
  ArrowCurved,
  PaperPlane,
  HeartDoodle,
} from "@/components/doodles/basics";
import {
  UmbrellaShare,
  TiffinPass,
  HighFive,
} from "@/components/doodles/vignettes";
import { getSiteSettings } from "@/sanity/content";

/*
 * S1 · HERO — "The Living Doodle World" (spec §6-S1), full motion pass.
 * Choreography starts when the section scrolls into view (.s1-go via
 * InViewClass): logo intro (if first visit) → headline words sketch in →
 * sub fades up → CTAs pop with overshoot → vignette loops run.
 * Desktop extras: mouse parallax layers, cursor-proximity wiggle, and a
 * paper plane crossing the section every ~12s carrying a tiny heart.
 * All of it gated behind html.m (JS + motion allowed) — otherwise static.
 */
const HEADLINE_BEFORE = ["A", "society", "where"];
const HEADLINE_AFTER = [
  "each",
  "other",
  "is",
  "the",
  "default",
  "—",
  "not",
  "the",
  "exception.",
];

function Word({ text, index }: { text: string; index: number }) {
  /* the space must sit OUTSIDE the span — inline-block swallows it inside */
  return (
    <>
      <span className="word" style={{ "--wi": index } as React.CSSProperties}>
        {text}
      </span>{" "}
    </>
  );
}

export async function S1Hero() {
  const site = await getSiteSettings();
  return (
    <section
      id="world"
      className="relative flex min-h-[calc(100vh-64px)] flex-col overflow-hidden"
    >
      <InViewClass addClass="s1-go" className="flex flex-1">
        <HeroParallax className="relative mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-14">
          {/* headline block, center-left on desktop */}
          <div className="relative z-10 flex max-w-2xl flex-col items-start gap-6 lg:w-[60%]">
            <LogoAnimated className="h-28 w-auto md:h-36" />
            <h1 className="hero-title">
              {HEADLINE_BEFORE.map((w, i) => (
                <Word key={i} text={w} index={i} />
              ))}
              <span
                className="word relative inline-block"
                style={{ "--wi": 3 } as React.CSSProperties}
              >
                helping
                {/* spark circle, scribbled on after the headline completes */}
                <svg
                  viewBox="0 0 120 60"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+24px)] text-spark"
                  aria-hidden
                >
                  <path
                    className="hero-circle"
                    pathLength={1}
                    d="M8 30 C10 12 40 4 62 6 C92 8 114 16 112 32 C110 48 78 56 52 54 C24 52 6 44 8 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              {HEADLINE_AFTER.map((w, i) => (
                <Word key={i} text={w} index={i + 4} />
              ))}
            </h1>
            <p className="hero-sub text-lg leading-relaxed">
              Sapiens is a community where real people help real people —
              offline, nearby, for nothing in return. Someone near you needs a
              hand right now. Someone near you is ready to give one.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="hero-cta" style={{ "--ci": 0 } as React.CSSProperties}>
                <ButtonLink href="#join">Join the movement</ButtonLink>
              </span>
              <span className="hero-cta" style={{ "--ci": 1 } as React.CSSProperties}>
                <ButtonLink href={site.volunteerFormUrl} variant="secondary" newTab>
                  Become a founding volunteer
                </ButtonLink>
              </span>
            </div>
            <p className="hero-sub text-sm font-semibold tracking-wide">
              Launching in India, 2026. No app needed yet — just belief.
            </p>

            {/* mobile: the two vignettes live in the flow, never over text */}
            <div className="flex w-full items-end justify-center gap-12 pt-6 md:hidden">
              <Doodle className="vignette block w-28 text-ink">
                <UmbrellaShare title="Two people sharing an umbrella in the rain" />
              </Doodle>
              <Doodle
                className="vignette block w-28 text-ink"
                delay={400}
              >
                <HighFive title="Two people high-fiving" />
              </Doodle>
            </div>
          </div>

          {/* the living doodle world around the edges (desktop) */}
          <span data-plx="1" className="absolute top-8 right-[8%] hidden w-40 md:block">
            <span data-wiggle className="block">
              <Doodle className="vignette block text-ink" delay={200}>
                <UmbrellaShare title="Two people sharing an umbrella in the rain" />
              </Doodle>
            </span>
          </span>
          <span data-plx="2" className="absolute right-[4%] bottom-[30%] hidden w-40 lg:block">
            <span data-wiggle className="block">
              <Doodle className="vignette block text-ink" delay={600} >
                <HighFive title="Two people high-fiving" />
              </Doodle>
            </span>
          </span>
          <span data-plx="1" className="absolute right-[28%] bottom-8 hidden w-36 md:block">
            <span data-wiggle className="block">
              <Doodle className="vignette block text-ink" delay={1000}>
                <TiffinPass title="A tiffin passed from one hand to another" />
              </Doodle>
            </span>
          </span>

          {/* drifting clouds, three speeds */}
          <span data-plx="2" className="cloud-drift absolute top-10 left-[42%] hidden w-20 opacity-50 lg:block" style={{ "--drift": "90s" } as React.CSSProperties}>
            <Doodle className="block"><CloudA /></Doodle>
          </span>
          <span data-plx="1" className="cloud-drift absolute top-[38%] right-[18%] hidden w-14 opacity-40 md:block" style={{ "--drift": "60s" } as React.CSSProperties}>
            <Doodle className="block" delay={400}><CloudB /></Doodle>
          </span>
          <span data-plx="2" className="cloud-drift absolute bottom-[18%] left-[2%] hidden w-12 opacity-40 xl:block" style={{ "--drift": "120s" } as React.CSSProperties}>
            <Doodle className="block" delay={800}><CloudC /></Doodle>
          </span>

          {/* paper plane: crosses the hero every ~12s, dashed trail, tiny heart */}
          <span aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
            <svg className="plane-trail absolute inset-0 h-full w-full" viewBox="0 0 1200 700" preserveAspectRatio="none">
              <path
                d="M -60 480 C 260 320, 620 520, 1260 220"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="7 11"
                className="text-ink/30"
              />
            </svg>
            <span className="plane-flyer absolute">
              <PaperPlane className="w-12 text-ink" />
              <HeartDoodle className="absolute -top-3 left-10 w-4 text-spark" />
            </span>
          </span>

          {/* scroll cue */}
          <a
            href="#ache"
            aria-label="Scroll to the next section"
            className="bob-cue absolute bottom-4 left-1/2 hidden -translate-x-1/2 rotate-90 md:block"
          >
            <ArrowCurved className="w-10 text-ink/70" />
          </a>
        </HeroParallax>
      </InViewClass>

      {/* marquee strip at the hero's bottom edge */}
      <Marquee />
    </section>
  );
}
