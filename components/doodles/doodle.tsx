"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Wraps any doodle SVG and triggers its line-draw animation the first time
 * it scrolls into view (spec §2.3). Inside a doodle:
 *   class "dd"  = stroked element that draws itself (needs pathLength={1})
 *   class "ddf" = filled accent that pops in after the strokes finish
 * Without JavaScript, or with prefers-reduced-motion, the doodle simply
 * renders in its finished state — nothing is ever hidden permanently.
 */
export function Doodle({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number; // extra ms before this doodle starts drawing
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const state = drawn ? "doodle-drawn" : armed ? "doodle-pending" : "";
  return (
    <span
      ref={ref}
      className={`doodle inline-block ${state} ${className}`}
      style={
        delay
          ? ({ "--dd-delay": `${delay}ms` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </span>
  );
}
