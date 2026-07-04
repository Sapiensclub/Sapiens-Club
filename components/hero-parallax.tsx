"use client";

import { useEffect, useRef } from "react";

/*
 * Desktop-only mouse parallax for the hero's doodle world (spec §6-S1):
 * layers marked data-plx="1" / data-plx="2" drift up to ±8px with the
 * cursor, and doodles marked data-wiggle tilt ±2° when the cursor comes
 * within 80px. Touch devices and reduced-motion get none of this.
 */
export function HeroParallax({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width - 0.5) * 2; // -1 … 1
        const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
        el.style.setProperty("--plx-x", nx.toFixed(3));
        el.style.setProperty("--plx-y", ny.toFixed(3));

        el.querySelectorAll<HTMLElement>("[data-wiggle]").forEach((d) => {
          const b = d.getBoundingClientRect();
          const dist = Math.hypot(
            e.clientX - (b.left + b.width / 2),
            e.clientY - (b.top + b.height / 2)
          );
          d.classList.toggle("wiggling", dist < 80);
        });
      });
    };

    const onLeave = () => {
      el.style.setProperty("--plx-x", "0");
      el.style.setProperty("--plx-y", "0");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
