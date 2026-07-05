"use client";

import { useEffect, useRef, useState } from "react";
import type { JourneyStage, Milestone } from "@/sanity/content";
import { capture } from "@/components/analytics";

/*
 * THE CELESTIAL JOURNEY (spec §8) — the signature scroll piece.
 *
 * A ~350vh wrapper (260vh on mobile) pins a full-viewport stage via
 * position: sticky. Scroll progress 0→1 maps to helps 0→1000 through a
 * piecewise curve that gives the early milestones room:
 *   0–0.45 → 0–100 · 0.45–0.75 → 100–500 · 0.75–0.92 → 500–1000 ·
 *   0.92–1.0 → galaxy finale (the personal sun dissolves INTO it).
 *
 * Implementation notes (spec §8.8): no GSAP — sticky pinning + one
 * rAF-throttled scroll handler writing CSS custom properties. Everything
 * animated is transform/opacity only; the stars are a single SVG layer.
 * React state changes only at discrete thresholds (caption swaps).
 *
 * Without JS or with reduced motion (html.m absent) the scrub is hidden
 * and a static 6-panel storyboard renders instead (spec §8.7).
 */

/* piecewise progress → helps */
function helpsFor(p: number): number {
  if (p <= 0.45) return Math.round((p / 0.45) * 100);
  if (p <= 0.75) return Math.round(100 + ((p - 0.45) / 0.3) * 400);
  if (p <= 0.92) return Math.round(500 + ((p - 0.75) / 0.17) * 500);
  return 1000;
}

/*
 * Deterministic spiral of 46 gold stars. Coordinates are rounded to one
 * decimal because raw Math.cos/sin results can differ in the last float
 * digit between server and browser — enough to break hydration.
 */
const STARS = Array.from({ length: 46 }, (_, i) => {
  const angle = i * 2.39996; // golden angle
  const radius = 14 + i * 5.4;
  return {
    x: Math.round((300 + Math.cos(angle) * radius) * 10) / 10,
    y: Math.round((300 + Math.sin(angle) * radius * 0.82) * 10) / 10,
    r: 1.3 + (i % 5) * 0.45,
    o: 0.5 + ((i * 7) % 10) / 20,
  };
});

/* the moon assembly — shared by the scrub stage and the storyboard */
function Moon({ helps, mini = false }: { helps?: number; mini?: boolean }) {
  const style =
    helps === undefined
      ? undefined
      : ({
          "--phase": -Math.min(helps, 100),
          "--warm": Math.min(1, Math.max(0, (helps - 100) / 900)).toFixed(3),
          "--rays": Math.min(1, Math.max(0, (helps - 450) / 300)).toFixed(3),
        } as React.CSSProperties);
  return (
    <div className={`moon-wrap ${mini ? "moon-mini" : ""}`} style={style} aria-hidden>
      <div className="moon-glow" />
      <div className="moon-glow-warm" />
      <div className="moon-rays" />
      <div className="moon">
        <div className="moon-base" />
        <div className="moon-warm" />
        <div className="moon-shadow" />
      </div>
    </div>
  );
}

export function CelestialJourney({
  stages,
  milestones,
}: {
  stages: JourneyStage[];
  milestones: Milestone[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [caption, setCaption] = useState<{ name: string; text: string }>({
    name: stages[0]?.name ?? "New moon",
    text: stages[0]?.caption ?? "Your journey begins",
  });
  const [inGalaxy, setInGalaxy] = useState(false);

  useEffect(() => {
    if (!document.documentElement.classList.contains("m")) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const stage = wrap.querySelector<HTMLElement>(".journey-stage");
    if (!stage) return;
    const helpsEl = stage.querySelector<HTMLElement>(".j-helps");
    const monetaEl = stage.querySelector<HTMLElement>(".j-moneta");
    const meterFill = stage.querySelector<HTMLElement>(".j-meter-fill");
    const meterNum = stage.querySelector<HTMLElement>(".j-meter-num");
    const dots = stage.querySelectorAll<HTMLElement>(".mdot");

    let raf = 0;
    let lastHelps = -1;
    let lastStageIdx = -1;
    let lastGalaxy = false;

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      const h = helpsFor(p);
      const g = p <= 0.92 ? 0 : (p - 0.92) / 0.08;

      if (h === lastHelps && g === 0 && !lastGalaxy) return;
      lastHelps = h;

      const warm = Math.min(1, Math.max(0, (h - 100) / 900));
      stage.style.setProperty("--phase", String(-Math.min(h, 100)));
      stage.style.setProperty("--warm", warm.toFixed(3));
      stage.style.setProperty(
        "--rays",
        (Math.min(1, Math.max(0, (h - 450) / 300)) * (1 - g)).toFixed(3)
      );
      stage.style.setProperty("--g", g.toFixed(3));
      stage.style.setProperty("--horizon", Math.min(1, p * 1.1).toFixed(3));

      if (helpsEl) helpsEl.textContent = String(h);
      if (monetaEl) monetaEl.textContent = String(h);
      const gm = Math.round(100 * (1 - Math.exp(-h / 280)));
      if (meterFill) meterFill.style.transform = `scaleX(${gm / 100})`;
      if (meterNum) meterNum.textContent = String(gm);
      dots.forEach((d, i) => {
        const m = milestones[i];
        if (m) d.classList.toggle("lit", h >= m.helps);
      });

      /* caption swaps at thresholds; the galaxy gets the final line */
      const galaxyNow = g > 0.5;
      let idx = 0;
      stages.forEach((s, i) => {
        if (h >= s.threshold) idx = i;
      });
      if (galaxyNow !== lastGalaxy || (!galaxyNow && idx !== lastStageIdx)) {
        lastGalaxy = galaxyNow;
        lastStageIdx = idx;
        if (galaxyNow) {
          setInGalaxy(true);
          capture("journey_completed");
          setCaption({
            name: "",
            text: "Individually we glow. Together, we are a galaxy.",
          });
        } else {
          setInGalaxy(false);
          const s = stages[idx];
          setCaption({ name: s.name, text: s.caption });
        }
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stages, milestones]);

  /* storyboard panels: one per stage (spec §8.7 reduced-motion fallback) */
  const storyboard = (
    <div className="journey-storyboard mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-3">
      {stages.map((s) => (
        <figure key={s.threshold} className="flex flex-col items-center gap-3 text-center">
          <Moon helps={s.threshold} mini />
          <figcaption>
            <span className="font-display block text-lg font-bold text-gold">
              {s.name}
            </span>
            <span className="text-xs text-moonlight/70">
              {s.threshold} helps
            </span>
            <span className="block text-sm text-moonlight">{s.caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );

  return (
    <>
      {storyboard}
      <div ref={wrapRef} className="journey-scrub relative h-[260vh] md:h-[350vh]">
        <div className="journey-stage sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
          {/* warm glow rising from the horizon */}
          <div className="journey-horizon" aria-hidden />

          {/* the personal moon/sun — dissolves into the galaxy at the end */}
          <div className="journey-body">
            <Moon />
          </div>

          {/* the shared galaxy: spiral haze + 46 gold stars, one layer */}
          <div className="journey-galaxy" aria-hidden>
            <div className="galaxy-haze" />
            <svg viewBox="0 0 600 600" className="h-[70vh] w-full">
              {STARS.map((s, i) => (
                <circle
                  key={i}
                  cx={s.x}
                  cy={s.y}
                  r={s.r}
                  fill="var(--color-gold)"
                  opacity={s.o}
                />
              ))}
            </svg>
          </div>

          {/* caption — re-keyed so each swap fades up */}
          <div className="relative z-10 mt-10 min-h-20 px-6 text-center">
            <p
              key={caption.text}
              className={`journey-caption font-display text-2xl font-bold md:text-3xl ${
                inGalaxy ? "text-gold" : "text-moonlight"
              }`}
            >
              {caption.text}
            </p>
            {caption.name && (
              <p className="mt-1 text-sm tracking-widest text-moonlight/60 uppercase">
                {caption.name}
              </p>
            )}
          </div>

          {/* HUD: side rail on desktop, bottom strip on mobile (spec §8.5) */}
          <div className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-center gap-6 text-sm md:inset-x-auto md:right-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:flex-col md:items-end md:gap-5">
            <div className="text-center md:text-right">
              <span className="j-helps font-display block text-2xl font-bold text-gold">0</span>
              <span className="text-xs text-moonlight/70">Helps</span>
            </div>
            <div className="text-center md:text-right">
              <span className="j-moneta font-display block text-2xl font-bold text-gold">0</span>
              <span className="text-xs text-moonlight/70">Moneta</span>
            </div>
            <div className="text-center md:text-right">
              <div className="h-2 w-28 overflow-hidden rounded-full bg-moonlight/20">
                <div className="j-meter-fill h-full w-full origin-left scale-x-0 rounded-full bg-gold" />
              </div>
              <span className="text-xs text-moonlight/70">
                Goodness Meter <span className="j-meter-num">0</span>/100
              </span>
            </div>
            <div className="flex gap-2 md:justify-end" aria-hidden>
              {milestones.map((m) => (
                <span key={m.helps} className="mdot" title={m.label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
