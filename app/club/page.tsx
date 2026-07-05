import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import { getSiteSettings, getPageClub } from "@/sanity/content";

export const metadata: Metadata = {
  title: "The Sapiens Club — the first thousand",
  description:
    "Join the waitlist, apply to be a Founding Sapiens, or bring Sapiens to your campus, company or housing society first.",
};

/*
 * /club (spec §7). Editable in the studio ("Pages → Club"); constants
 * below are the fallbacks. The waitlist form and volunteer link stay
 * wired to Site settings.
 */
const ORG_POINTS = [
  "Early city access",
  "A launch partner badge",
  "Co-designed onboarding for your community",
];
const FOUNDING_PERKS = [
  {
    title: "A numbered founding membership",
    body: "Founding Sapiens #001–#1000. Your number is yours forever — nobody else will ever hold it.",
  },
  {
    title: "A permanent founding badge",
    body: "On your future profile, visible to everyone you ever help. It says: I was here before there was an app to believe in.",
  },
  {
    title: "Beta access before anyone else",
    body: "You'll use Sapiens — and shape it — months before your city does.",
  },
  {
    title: "Your name on the Founding Wall",
    body: "When we launch, the first thousand names go up together. The wall stays up for good.",
  },
  {
    title: "First consideration for City Saviour roles",
    body: "When paid helper roles arrive later, Founding Sapiens are the first people we call.",
  },
];

export default async function ClubPage() {
  const [site, cms] = await Promise.all([getSiteSettings(), getPageClub()]);
  const heading = cms?.heading || "The first thousand.";
  const tagline =
    cms?.tagline || "The ones who believed before there was an app to believe in.";
  const waitlistHeading = cms?.waitlistHeading || "Join the movement";
  const waitlistIntro =
    cms?.waitlistIntro ||
    "The waitlist is how Sapiens decides where to launch first. Tell us your city, and you'll know the day it opens there.";
  const foundingHeading = cms?.foundingHeading || "Become a Founding Sapiens";
  const foundingIntro =
    cms?.foundingIntro ||
    "One thousand places. Applications read by humans — every single one.";
  const perks = cms?.perks?.length ? cms.perks : FOUNDING_PERKS;
  const orgHeading = cms?.orgHeading || "Bring Sapiens to your community first";
  const orgBody =
    cms?.orgBody ||
    "Movements need soil. A university campus, a company, a housing society, an NGO — communities where trust already has roots are where Sapiens will bloom first. If you lead one, let's talk.";
  const orgPoints = cms?.orgPoints?.length ? cms.orgPoints : ORG_POINTS;

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-center">{heading}</h1>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg italic leading-relaxed">
        {tagline}
      </p>

      {/* Tier 1 — waitlist */}
      <section className="mt-20 grid items-start gap-10 md:grid-cols-2">
        <div>
          <h2 className="!text-3xl">{waitlistHeading}</h2>
          <p className="mt-4 leading-relaxed">{waitlistIntro}</p>
        </div>
        <WaitlistForm source="club" cities={site.cities} />
      </section>

      {/* Tier 2 — Founding Sapiens */}
      <section className="mt-24">
        <h2 className="!text-3xl">{foundingHeading}</h2>
        <p className="mt-4 max-w-2xl leading-relaxed">{foundingIntro}</p>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {perks.map(({ title, body }) => (
            <div
              key={title}
              className="sketch-border border-2 border-ink/60 px-6 py-7"
            >
              <h3 className="font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink
            href={site.volunteerFormUrl}
            newTab
            data-analytics="volunteer_click"
          >
            Apply to be a Founding Sapiens
          </ButtonLink>
        </div>
      </section>

      {/* Organizations */}
      <section
        id="organizations"
        className="sketch-border mt-24 scroll-mt-24 border-2 border-ink/70 bg-dawn px-8 py-12 text-center"
      >
        <h2>{orgHeading}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
          {orgBody}
        </p>
        <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-bold">
          {orgPoints.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className="mt-8">
          <ButtonLink href={`mailto:${site.contactEmail}`}>
            Write to us
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
