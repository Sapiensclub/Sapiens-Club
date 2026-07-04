"use client";

import { useEffect, useRef, useState } from "react";
import {
  PeopleBackToBack,
  PeopleFacing,
} from "@/components/doodles/vignettes";

/*
 * S2's emotional beat (spec §6-S2): two figures back-to-back on phones;
 * when the visitor scrolls them past the middle of the screen, they turn
 * to face each other (400ms crossfade). One-way — once they've turned,
 * they stay turned. Reduced motion shows the facing pose immediately.
 */
export function AcheFigures() {
  const ref = useRef<HTMLDivElement>(null);
  const [facing, setFacing] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFacing(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFacing(true);
          io.disconnect();
        }
      },
      /* fires when the figures cross the middle band of the viewport */
      { rootMargin: "-45% 0px -45% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative mx-auto mt-16 aspect-[120/96] w-48">
      <PeopleBackToBack
        className={`absolute inset-0 transition-opacity duration-[400ms] ${facing ? "opacity-0" : "opacity-100"}`}
        title={facing ? undefined : "Two people back to back, each looking at a phone"}
      />
      <PeopleFacing
        className={`absolute inset-0 transition-opacity duration-[400ms] ${facing ? "opacity-100" : "opacity-0"}`}
        title={facing ? "Two people turned to face each other" : undefined}
      />
    </div>
  );
}
