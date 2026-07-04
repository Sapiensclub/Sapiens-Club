import Link from "next/link";
import { site } from "@/lib/site";
import { LogoMark } from "./logo";
import {
  DiyaDoodle,
  IconInstagram,
  IconYouTube,
  IconX,
} from "./doodles/basics";

/*
 * Footer (spec §5) — dawn-tinted paper, four rows, a diya flickering in
 * the corner. Contact email and social URLs come from lib/site.ts (they
 * move into the CMS in stage 4 — never hardcode them elsewhere).
 */
const FOOT_NAV = [
  { label: "What", href: "/what" },
  { label: "Why", href: "/why" },
  { label: "How", href: "/how" },
  { label: "Club", href: "/club" },
  { label: "Shop", href: "/shop" },
  { label: "For Organizations", href: "/club#organizations" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="relative bg-dawn text-ink">
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-14">
        {/* Row 1: mark + line */}
        <div className="flex flex-col items-center gap-4 text-center">
          <LogoMark className="h-14 w-auto" title="Sapiens footprint logo" />
          <p className="font-display text-xl font-bold">
            One small step for you. A giant leap for all of us.
          </p>
        </div>

        {/* Row 2: nav */}
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm font-semibold">
            {FOOT_NAV.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="hover:text-clay">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Row 3: socials */}
        <div className="flex items-center justify-center gap-6">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sapiens on Instagram"
            className="hover:text-clay"
          >
            <IconInstagram className="h-7 w-7" />
          </a>
          <a
            href={site.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sapiens on YouTube"
            className="hover:text-clay"
          >
            <IconYouTube className="h-7 w-8" />
          </a>
          <a
            href={site.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sapiens on X"
            className="hover:text-clay"
          >
            <IconX className="h-6 w-6" />
          </a>
        </div>

        {/* Row 4: small print */}
        <div className="flex flex-col items-center gap-2 text-center text-sm">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a href={`mailto:${site.contactEmail}`} className="hover:text-clay">
              {site.contactEmail}
            </a>
            <Link href="/privacy" className="hover:text-clay">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-clay">
              Terms
            </Link>
          </div>
          <p className="opacity-80">
            © 2026 Sapiens Club. Made with care, for a kinder world.
          </p>
        </div>
      </div>

      {/* the diya in the corner, flame flickering */}
      <DiyaDoodle
        className="pointer-events-none absolute right-5 bottom-4 h-10 w-auto"
        title="A small diya lamp"
      />
    </footer>
  );
}
