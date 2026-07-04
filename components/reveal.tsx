"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Generic scroll-entrance wrapper (spec §14 stage 6). Children fade/slide
 * in the first time they enter the viewport. Without JS or with reduced
 * motion, content renders complete — hiding only starts once JS arms it.
 *
 * effect: "up" (default) fade + rise · "stamp" rubber-stamp rotate-in
 */
export function Reveal({
  children,
  delay = 0,
  effect = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  effect?: "up" | "stamp";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const state = shown ? "reveal-in" : armed ? `reveal-${effect}` : "";
  return (
    <div
      ref={ref}
      className={`${state} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/*
 * Adds a class to itself when it first enters the viewport — used by the
 * living-doodle hero to start its whole choreography (html.m .s1-go ...).
 */
export function InViewClass({
  children,
  addClass,
  className = "",
}: {
  children: React.ReactNode;
  addClass: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} ${inView ? addClass : ""}`}>
      {children}
    </div>
  );
}
