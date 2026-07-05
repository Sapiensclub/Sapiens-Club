import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Prose } from "@/components/portable";
import { getProsePage } from "@/sanity/content";

export const metadata: Metadata = {
  title: "Privacy — Sapiens",
  description:
    "What Sapiens collects (very little), why, where it lives, and how to have it deleted. No selling of data, no ads.",
};

/*
 * OWNER SHOULD HAVE THESE PROFESSIONALLY REVIEWED BEFORE SCALE.
 * Editable in the studio ("Pages → Privacy"); built-in DPDP-aware draft
 * below is the fallback.
 */
export default async function PrivacyPage() {
  const cms = await getProsePage("privacy");
  if (cms?.content?.length) {
    return (
      <article className="mx-auto max-w-[65ch] px-6 py-20 leading-relaxed">
        <h1>{cms.title ?? "Privacy"}</h1>
        <Prose value={cms.content} />
      </article>
    );
  }
  return (
    <article className="mx-auto max-w-[65ch] px-6 py-20 leading-relaxed">
      <h1>Privacy</h1>
      <p className="mt-3 text-sm opacity-70">Last updated: 4 July 2026</p>

      <p className="mt-8 text-lg">
        The short version: we collect the minimum, we never sell it, and we
        show no ads. The long version is below — written to be read, not
        skimmed past.
      </p>

      <h2 className="mt-12 !text-2xl">What we collect, and why</h2>
      <ul className="mt-4 list-disc space-y-3 pl-5">
        <li>
          <strong>Waitlist:</strong> your email (required), phone (optional)
          and city (optional) — so we can tell you when Sapiens launches,
          especially in your city. You give this with an explicit consent
          checkbox; unticked, nothing is stored.
        </li>
        <li>
          <strong>Contact form:</strong> your name, email and message — so a
          human can reply to you.
        </li>
        <li>
          <strong>Analytics:</strong> anonymous usage events (pages viewed,
          buttons clicked) via PostHog and Vercel Analytics, used only to
          make the site better. No advertising cookies, no cross-site
          tracking, no profiles built about you.
        </li>
      </ul>

      <h2 className="mt-12 !text-2xl">Where it lives</h2>
      <p className="mt-4">
        Waitlist and contact submissions are stored in Supabase, our database
        provider, protected by row-level security so they are not publicly
        readable. Emails we send go through Resend. The site is hosted on
        Vercel.
      </p>

      <h2 className="mt-12 !text-2xl">What we will never do</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5">
        <li>Sell, rent or trade your data. To anyone. For anything.</li>
        <li>Show you ads or let advertisers near your information.</li>
        <li>Email you more than genuinely necessary — about one email a month.</li>
      </ul>

      <h2 className="mt-12 !text-2xl">Your rights</h2>
      <p className="mt-4">
        Under India&apos;s Digital Personal Data Protection Act, you can ask
        what we hold about you, ask us to correct it, or ask us to delete it
        entirely. One email to{" "}
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-bold underline decoration-spark decoration-2 underline-offset-4"
        >
          {site.contactEmail}
        </a>{" "}
        does any of the three — no forms, no friction. Unsubscribing from
        emails is one click in any email we send.
      </p>

      <h2 className="mt-12 !text-2xl">Cookies</h2>
      <p className="mt-4">
        Only what analytics needs to count you once instead of twice. No
        advertising or third-party marketing cookies.
      </p>

      <h2 className="mt-12 !text-2xl">Governing law</h2>
      <p className="mt-4">
        This policy is governed by the laws of India. If we ever change it
        meaningfully, the date at the top changes and — if you&apos;re on
        the waitlist — we&apos;ll tell you.
      </p>
    </article>
  );
}
