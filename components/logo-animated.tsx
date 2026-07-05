"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./logo";
import { SOLE, TOES, TOE_HEADS } from "./logo-paths";

/*
 * Hero intro animation (spec §3), ~2.5s, plays once per session:
 *   1. 0–0.8s  five ink circles ("heads" of walking people) slide in from
 *              the left along a gentle arc, with three curved body strokes
 *              walking beneath them.
 *   2. 0.8–1.6s heads drift up and settle into the five toe positions while
 *              the body strokes dissolve and the S-sole draws itself.
 *   3. 1.6–2.5s fill sweeps into the sole, a spark sparkle pops top-right,
 *              gentle settle.
 * Meaning: people, together, moving forward, leaving a mark.
 *
 * Skipped when: already seen this session (sessionStorage.sapiens_intro_seen),
 * prefers-reduced-motion, or the visitor scrolls/clicks during playback.
 * All timing lives in globals.css under "LOGO INTRO".
 */
const BODY_STROKES = [
  "M402 336 C432 322 470 332 505 320",
  "M420 354 C450 341 486 349 520 337",
  "M410 369 C445 357 480 363 516 353",
];

export function LogoAnimated({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<"static" | "play">("static");

  /*
   * The intro starts when the logo scrolls into view. It lives in the
   * minimal hero (top of the page), so on the homepage it fires on load;
   * the IntersectionObserver keeps it correct anywhere else it's used.
   * It no longer couples to the S1 headline (they're separate sections now).
   */
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced || sessionStorage.getItem("sapiens_intro_seen")) return;
    const el = wrapRef.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => setMode("static");
    const skip = () => {
      clearTimeout(timer);
      finish();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        sessionStorage.setItem("sapiens_intro_seen", "1");
        setMode("play");
        timer = setTimeout(finish, 2600);
        window.addEventListener("scroll", skip, { once: true, passive: true });
        window.addEventListener("pointerdown", skip, { once: true });
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(timer);
      window.removeEventListener("scroll", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  if (mode === "static") {
    return (
      <span ref={wrapRef} className="inline-block">
        <LogoMark className={className} title="Sapiens footprint logo" />
      </span>
    );
  }

  return (
    <svg
      viewBox="390 60 240 330"
      className={`logo-intro ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* stage 1: three body strokes walking beneath the heads */}
      {BODY_STROKES.map((d, i) => (
        <path
          key={`b${i}`}
          d={d}
          pathLength={1}
          className="li-stroke"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      {/* stage 2: the sole draws itself, then fills */}
      {SOLE.map((d, i) => (
        <path
          key={`s${i}`}
          d={d}
          pathLength={1}
          className="li-sole"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      {/* toes fade in as the heads land on them */}
      {TOES.map((d, i) => (
        <path
          key={`t${i}`}
          d={d}
          className="li-toe"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      {/* the five walking heads */}
      {TOE_HEADS.map((h, i) => (
        <circle
          key={`h${i}`}
          cx={h.x}
          cy={h.y}
          r={h.r}
          className="li-head"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
      {/* stage 3: spark sparkle pops top-right */}
      <path
        className="li-spark"
        d="M604 96 C605 104 607 108 615 111 C607 114 605 118 604 126 C603 118 601 114 593 111 C601 108 603 104 604 96 Z"
      />
    </svg>
  );
}
