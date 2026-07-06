"use client";

import { useEffect, useRef, useState } from "react";

/*
 * FOOTPRINT TRAIL — hidden hero easter-egg (owner request, July 2026).
 *
 * Move the cursor (or drag a finger) across the hero: night falls softly
 * around a torch-beam of light at the pointer, and glowing footprints are
 * stamped along the path — alternating left/right, facing the direction of
 * travel — then dissolve back into the dark. Idle = completely invisible.
 *
 * EASY DISABLE: Studio → Site settings → "Footprint hero effect" (live,
 * no deploy), or flip FEATURE_FALLBACK_ENABLED below. When disabled the
 * component renders nothing and attaches no listeners. To remove the
 * feature entirely: delete this file, its import/mount in
 * s0-minimal-hero.tsx, and the footprintEffectEnabled field in the
 * siteSettings schema/getter.
 *
 * Implementation: ONE <canvas> (absolute, pointer-events:none) drawn via
 * requestAnimationFrame. Canvas keeps everything in a single layer: the
 * indigo scrim, the torch hole and the content-legibility halo are punched
 * out with destination-out gradients, prints are Path2D stamps. The loop
 * only runs while something is visible — zero idle cost. Pointer listeners
 * are PASSIVE on the parent hero section; scrolling is never blocked.
 */

/* ====================== TUNABLE CONSTANTS ====================== */
const PRINT_SPACING = 70; // px of pointer travel between stamps (sparse, not every pixel)
const PRINT_LIFETIME = 1300; // ms until a print fully fades
const FADE_IN = 120; // ms
const TORCH_RADIUS = 150; // px radius of the light pool
const SCRIM_OPACITY = 0.8; // max darkness of the night scrim, 0–1 (lower if logo gets hard to read)
const PRINT_SIZE = 26; // px (print height)
const PERP_OFFSET = 12; // px sideways offset for L/R feet
const MAX_PRINTS = 18; // hard cap; remove the oldest beyond this

/* secondary tunables */
const SCRIM_FADE_IN_MS = 350; // night blooms in
const SCRIM_FADE_OUT_MS = 500; // night releases
const STOP_DELAY_MS = 900; // stillness before the night starts fading
const HALO_RX = 330; // content-legibility halo, x radius (px)
const HALO_RY = 380; // content-legibility halo, y radius (px)
const HALO_CLEAR = 0.88; // how fully the halo clears the scrim at its center, 0–1
const MAX_DPR = 2;

/* code-level fallback when the CMS field is unset */
const FEATURE_FALLBACK_ENABLED = true;

/* ====================== VARIANTS ====================== */
/*
 * 'night' (wired now): dark scrim + torch + white/glowing prints.
 * 'day' (LATER — stub, unwired): NO scrim, NO torch; ink prints (#141414)
 *   pressed into the paper along the path, same stamping/alternating
 *   logic. To wire it, mount <FootprintTrail variant="day" /> — the
 *   styling below is ready; only night has been hand-tuned so far.
 */
type Variant = "night" | "day";
const VARIANTS: Record<
  Variant,
  {
    scrim: boolean;
    scrimInner: [number, number, number]; // night  #17142E
    scrimOuter: [number, number, number]; // deep   #0B0A18
    print: string;
    glow: string; // "" = no glow
  }
> = {
  night: {
    scrim: true,
    scrimInner: [23, 20, 46],
    scrimOuter: [11, 10, 24],
    print: "#F7F4EC", // paper — glowing prints
    glow: "#CDD6FF", // moonlight halo around each print
  },
  day: {
    scrim: false,
    scrimInner: [0, 0, 0],
    scrimOuter: [0, 0, 0],
    print: "#141414", // ink pressed into the paper
    glow: "",
  },
};

/* simple foot-sole silhouette (right foot, toes up, height 1 unit).
   Mirrored with scale(-1,1) for the left foot. */
function makeFoot(): Path2D {
  const p = new Path2D();
  p.ellipse(0.02, -0.05, 0.21, 0.27, -0.08, 0, Math.PI * 2); // ball + arch
  p.ellipse(0.04, 0.3, 0.15, 0.2, 0.1, 0, Math.PI * 2); // heel
  p.ellipse(-0.14, -0.4, 0.075, 0.09, 0, 0, Math.PI * 2); // big toe
  p.ellipse(0.01, -0.455, 0.055, 0.065, 0, 0, Math.PI * 2);
  p.ellipse(0.13, -0.44, 0.05, 0.06, 0, 0, Math.PI * 2);
  p.ellipse(0.23, -0.395, 0.045, 0.055, 0, 0, Math.PI * 2);
  p.ellipse(0.315, -0.32, 0.042, 0.05, 0, 0, Math.PI * 2);
  return p;
}

type Print = {
  x: number;
  y: number;
  angle: number; // movement direction (radians)
  side: 1 | -1; // right / left foot
  born: number;
};

export function FootprintTrail({
  variant = "night",
  enabled,
}: {
  variant?: Variant;
  enabled?: boolean;
}) {
  const on = enabled ?? FEATURE_FALLBACK_ENABLED;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* armed only after mount + motion allowed → SSR/no-JS/reduced-motion
     render nothing and attach nothing */
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!on) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
  }, [on]);

  useEffect(() => {
    if (!armed) return;
    const canvas = canvasRef.current;
    const host = canvas?.parentElement; // the hero section
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const v = VARIANTS[variant];
    const FOOT = makeFoot();
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);

    let w = 0;
    let h = 0;
    const resize = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* ---- state (refs only; no React re-renders) ---- */
    const prints: Print[] = [];
    const torch = { x: 0, y: 0, alpha: 0, target: 0 };
    let lastStamp: { x: number; y: number } | null = null;
    let nextSide: 1 | -1 = 1;
    let lastMoveAt = 0;
    let raf = 0;
    let lastTick = 0;

    const running = () => raf !== 0;
    const start = () => {
      if (!running()) {
        lastTick = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      ctx.clearRect(0, 0, w, h);
    };

    const stamp = (x: number, y: number, angle: number) => {
      const perpX = -Math.sin(angle) * PERP_OFFSET * nextSide;
      const perpY = Math.cos(angle) * PERP_OFFSET * nextSide;
      prints.push({
        x: x + perpX,
        y: y + perpY,
        angle,
        side: nextSide,
        born: performance.now(),
      });
      nextSide = nextSide === 1 ? -1 : 1;
      while (prints.length > MAX_PRINTS) prints.shift();
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      torch.x = x;
      torch.y = y;
      torch.target = 1;
      lastMoveAt = performance.now();
      if (!lastStamp) {
        lastStamp = { x, y };
      } else {
        const dx = x - lastStamp.x;
        const dy = y - lastStamp.y;
        if (Math.hypot(dx, dy) >= PRINT_SPACING) {
          stamp(x, y, Math.atan2(dy, dx));
          lastStamp = { x, y };
        }
      }
      start();
    };
    const onDown = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      torch.x = e.clientX - r.left;
      torch.y = e.clientY - r.top;
      torch.target = 1;
      lastMoveAt = performance.now();
      lastStamp = { x: torch.x, y: torch.y };
      start();
    };
    const release = () => {
      torch.target = 0;
      lastStamp = null;
    };

    /* PASSIVE listeners on the hero container — never preventDefault,
       never block scrolling; the canvas itself is pointer-events:none */
    const opts: AddEventListenerOptions = { passive: true };
    host.addEventListener("pointermove", onMove, opts);
    host.addEventListener("pointerdown", onDown, opts);
    host.addEventListener("pointerup", release, opts);
    host.addEventListener("pointerleave", release, opts);
    host.addEventListener("pointercancel", release, opts);

    /* ---- render loop ---- */
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, t - lastTick);
      lastTick = t;

      /* pointer went still → let the night fade back out */
      if (torch.target === 1 && t - lastMoveAt > STOP_DELAY_MS) torch.target = 0;

      /* ease the scrim toward its target */
      if (torch.alpha < torch.target)
        torch.alpha = Math.min(torch.target, torch.alpha + dt / SCRIM_FADE_IN_MS);
      else if (torch.alpha > torch.target)
        torch.alpha = Math.max(torch.target, torch.alpha - dt / SCRIM_FADE_OUT_MS);

      /* cull dead prints */
      while (prints.length && t - prints[0].born > PRINT_LIFETIME) prints.shift();

      /* ---- draw ---- */
      ctx.clearRect(0, 0, w, h);

      if (v.scrim && torch.alpha > 0.005) {
        const A = torch.alpha * SCRIM_OPACITY;
        const [ir, ig, ib] = v.scrimInner;
        const [or_, og, ob] = v.scrimOuter;
        const bg = ctx.createRadialGradient(
          w / 2, h / 2, 0,
          w / 2, h / 2, Math.max(w, h) * 0.75
        );
        bg.addColorStop(0, `rgba(${ir},${ig},${ib},${A})`);
        bg.addColorStop(1, `rgba(${or_},${og},${ob},${A})`);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        /* torch beam — punch a soft pool of light around the pointer */
        ctx.globalCompositeOperation = "destination-out";
        const beam = ctx.createRadialGradient(
          torch.x, torch.y, 0,
          torch.x, torch.y, TORCH_RADIUS
        );
        beam.addColorStop(0, "rgba(0,0,0,0.95)");
        beam.addColorStop(0.55, "rgba(0,0,0,0.5)");
        beam.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = beam;
        ctx.fillRect(0, 0, w, h);

        /* content halo — keep the centered logo/wordmark/tagline/button
           readable at all times (HARD REQUIREMENT) */
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(1, HALO_RY / HALO_RX);
        const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, HALO_RX);
        halo.addColorStop(0, `rgba(0,0,0,${HALO_CLEAR})`);
        halo.addColorStop(0.65, `rgba(0,0,0,${HALO_CLEAR * 0.55})`);
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(-w, -h * 2, w * 2, h * 4);
        ctx.restore();
        ctx.globalCompositeOperation = "source-over";
      }

      /* footprints */
      for (const pr of prints) {
        const age = t - pr.born;
        const ain = Math.min(1, age / FADE_IN);
        const aout = Math.max(
          0,
          1 - Math.max(0, age - FADE_IN) / (PRINT_LIFETIME - FADE_IN)
        );
        let a = ain * aout;
        if (v.scrim) {
          /* prints live in the dark: dissolve with the scrim, dim inside
             the content halo, glow a touch brighter near the torch */
          a *= Math.min(1, torch.alpha * 1.25);
          const hx = (pr.x - w / 2) / HALO_RX;
          const hy = (pr.y - h / 2) / HALO_RY;
          a *= Math.min(1, 0.15 + 0.85 * (hx * hx + hy * hy));
          const dTorch = Math.hypot(pr.x - torch.x, pr.y - torch.y);
          a *= 0.55 + 0.45 * Math.max(0, 1 - dTorch / (TORCH_RADIUS * 1.6));
        }
        if (a <= 0.01) continue;
        ctx.save();
        ctx.translate(pr.x, pr.y);
        ctx.rotate(pr.angle + Math.PI / 2);
        ctx.scale(pr.side * PRINT_SIZE, PRINT_SIZE);
        ctx.globalAlpha = a;
        ctx.fillStyle = v.print;
        if (v.glow) {
          ctx.shadowColor = v.glow;
          ctx.shadowBlur = 12;
        }
        ctx.fill(FOOT);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      /* everything faded → park the loop (zero idle cost) */
      if (torch.alpha <= 0 && torch.target === 0 && prints.length === 0) stop();
    };

    return () => {
      stop();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerup", release);
      host.removeEventListener("pointerleave", release);
      host.removeEventListener("pointercancel", release);
    };
  }, [armed, variant]);

  if (!on) return null;
  if (!armed) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      /* -z-10 keeps it behind the hero content; the hero section uses
         `isolate` so this negative layer stays contained to the hero */
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}
