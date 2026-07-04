"use client";

import { useEffect, useState } from "react";

/*
 * Night-mode toggle (owner request, July 2026). Flips the whole site to
 * the celestial-night palette by setting data-mode="night" on <html> —
 * the colour tokens are CSS variables, so every bg-paper / text-ink /
 * bg-dawn utility re-resolves instantly (overrides live in globals.css).
 * Choice persists in localStorage; an inline script in layout.tsx applies
 * it before first paint so there's no flash.
 */
export function ThemeToggle() {
  const [night, setNight] = useState(false);

  useEffect(() => {
    setNight(document.documentElement.getAttribute("data-mode") === "night");
  }, []);

  function toggle() {
    const next = !night;
    setNight(next);
    if (next) {
      document.documentElement.setAttribute("data-mode", "night");
    } else {
      document.documentElement.removeAttribute("data-mode");
    }
    try {
      localStorage.setItem("sapiens-theme", next ? "night" : "day");
    } catch {
      /* private browsing — the toggle still works for this visit */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={night}
      className="sketch-border inline-flex items-center gap-2.5 border-2 border-ink px-5 py-2 text-sm font-bold transition-transform hover:-rotate-1 hover:scale-105"
    >
      {night ? (
        <>
          {/* sun icon */}
          <svg viewBox="0 0 72 72" className="h-5 w-5 text-spark" aria-hidden>
            <g fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round">
              <path d="M36 14 C48 12 60 24 58 36 C60 48 47 59 36 58 C24 60 13 47 14 36 C12 24 24 13 36 14 Z" />
              <path d="M36 2 L36 8 M59 12 L54 17 M70 36 L63 36 M59 60 L54 55 M36 70 L36 63 M13 60 L18 55 M2 36 L9 36 M13 12 L18 17" />
            </g>
          </svg>
          Day mode
        </>
      ) : (
        <>
          {/* moon icon */}
          <svg viewBox="0 0 72 72" className="h-5 w-5 text-gold" aria-hidden>
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth={5}
              strokeLinecap="round"
              d="M46 10 C28 12 20 34 34 50 C18 48 8 32 14 18 C20 6 36 4 46 10 Z"
            />
          </svg>
          Night mode
        </>
      )}
    </button>
  );
}
