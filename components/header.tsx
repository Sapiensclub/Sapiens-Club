"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoLockup } from "./logo";
import { SquiggleUnderline, ToteBag, CloudB } from "./doodles/basics";

/*
 * Sticky header (spec §5). Paper background at 90% opacity + blur once
 * scrolled. Inverts to night colours whenever a section marked
 * data-theme="night" sits underneath it (sections arrive in stage 3+).
 * Mobile: hand-drawn hamburger → full-screen paper overlay with the five
 * nav words huge in Cabin Sketch, staggered slide-in.
 */
const NAV = [
  { label: "What", href: "/what" },
  { label: "Why", href: "/why" },
  { label: "How", href: "/how" },
  { label: "Club", href: "/club" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [night, setNight] = useState(false);
  const [open, setOpen] = useState(false);

  /* watch scroll position + whether a night section is under the header */
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
      const probe = 48; // y-coordinate the header occupies
      let dark = false;
      document.querySelectorAll('[data-theme="night"]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) dark = true;
      });
      setNight(dark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  /* mobile menu: lock body scroll, close on Escape */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* close the menu on navigation */
  useEffect(() => setOpen(false), [pathname]);

  const tone = night ? "text-paper" : "text-ink";
  const bg = night
    ? "bg-night/90 backdrop-blur-md shadow-sm"
    : scrolled
      ? "bg-paper/90 backdrop-blur-md shadow-sm"
      : "bg-transparent";

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${tone} ${bg}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <LogoLockup />

        {/* desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className="font-display relative text-lg font-bold uppercase tracking-wide hover:opacity-70"
              >
                {label}
                {active && (
                  <SquiggleUnderline className="absolute -bottom-2 left-0 w-full text-spark" />
                )}
              </Link>
            );
          })}
          <Link href="/shop" aria-label="Shop" className="hover:opacity-70">
            <ToteBag className="h-7 w-auto" />
          </Link>
        </nav>

        {/* mobile hamburger — hand-drawn ≡ */}
        <button
          type="button"
          className="md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 36 30" className="h-8 w-8" aria-hidden>
            {open ? (
              <g
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                fill="none"
              >
                <path d="M6 5 C14 13 22 21 30 26" />
                <path d="M30 5 C22 13 14 21 6 26" />
              </g>
            ) : (
              <g
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                fill="none"
              >
                <path d="M5 7 C14 5.5 24 6.5 31 6" />
                <path d="M5 15 C13 16.5 23 14.5 31 15.5" />
                <path d="M5 24 C15 22.5 22 24.5 31 23" />
              </g>
            )}
          </svg>
        </button>
      </div>

      {/* mobile full-screen overlay */}
      {open && (
        <div className="fixed inset-0 top-[64px] z-30 flex flex-col gap-2 overflow-y-auto bg-paper px-8 pt-10 pb-16 text-ink md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-6">
            {[...NAV, { label: "Shop", href: "/shop" }].map(
              ({ label, href }, idx) => (
                <Link
                  key={href}
                  href={href}
                  className="menu-item font-display text-5xl font-bold"
                  style={{ animationDelay: `${idx * 70}ms` }}
                  aria-current={pathname === href ? "page" : undefined}
                >
                  {label}
                </Link>
              )
            )}
          </nav>
          <CloudB className="pointer-events-none absolute right-6 bottom-10 w-24 opacity-40" />
        </div>
      )}
    </header>
  );
}
