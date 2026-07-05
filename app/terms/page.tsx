import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Prose } from "@/components/portable";
import { getProsePage } from "@/sanity/content";

export const metadata: Metadata = {
  title: "Terms — Sapiens",
  description:
    "Plain-English terms for using the Sapiens pre-launch website.",
};

/*
 * OWNER SHOULD HAVE THESE PROFESSIONALLY REVIEWED BEFORE SCALE.
 * Editable in the studio ("Pages → Terms"); built-in draft is the fallback.
 */
export default async function TermsPage() {
  const cms = await getProsePage("terms");
  if (cms?.content?.length) {
    return (
      <article className="mx-auto max-w-[65ch] px-6 py-20 leading-relaxed">
        <h1>{cms.title ?? "Terms"}</h1>
        <Prose value={cms.content} />
      </article>
    );
  }
  return (
    <article className="mx-auto max-w-[65ch] px-6 py-20 leading-relaxed">
      <h1>Terms</h1>
      <p className="mt-3 text-sm opacity-70">Last updated: 4 July 2026</p>

      <p className="mt-8 text-lg">
        These terms cover this website — the pre-launch home of Sapiens. When
        the app launches, it will have its own terms; nothing here signs you
        up for anything beyond this site.
      </p>

      <h2 className="mt-12 !text-2xl">What this site is</h2>
      <p className="mt-4">
        Sapiens.club describes a product that is being built and collects
        voluntary signups from people who want to hear about it. Joining the
        waitlist creates no account, costs nothing, and promises nothing
        except that we&apos;ll write to you — about once a month, and on
        launch day in your city.
      </p>

      <h2 className="mt-12 !text-2xl">What we ask of you</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5">
        <li>Submit only your own, accurate information.</li>
        <li>
          Don&apos;t attempt to disrupt the site, scrape other people&apos;s
          data, or abuse the forms.
        </li>
      </ul>

      <h2 className="mt-12 !text-2xl">What&apos;s ours</h2>
      <p className="mt-4">
        The Sapiens name, the footprint logo, the doodles and the words on
        this site belong to Sapiens Club. Please don&apos;t reuse them
        commercially without asking — we&apos;re friendly, just write to{" "}
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-bold underline decoration-spark decoration-2 underline-offset-4"
        >
          {site.contactEmail}
        </a>
        .
      </p>

      <h2 className="mt-12 !text-2xl">Honest limitations</h2>
      <p className="mt-4">
        Everything here describes an app that does not exist yet. Features,
        dates and cities may change as we build. The site is provided as-is;
        we work hard to keep it accurate and available, but we can&apos;t
        promise perfection, and we aren&apos;t liable for losses arising
        from relying on a pre-launch description.
      </p>

      <h2 className="mt-12 !text-2xl">Governing law</h2>
      <p className="mt-4">
        These terms are governed by the laws of India. Questions, concerns,
        disagreements — email first:{" "}
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-bold underline decoration-spark decoration-2 underline-offset-4"
        >
          {site.contactEmail}
        </a>
        . Humans read it.
      </p>
    </article>
  );
}
