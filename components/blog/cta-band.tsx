import { WaitlistForm } from "@/components/forms/waitlist-form";
import { Doodle } from "@/components/doodles/doodle";
import { SunriseDoodle } from "@/components/doodles/extras";
import { getSiteSettings } from "@/sanity/content";

/*
 * End-of-post CTA band (Blog Build Spec §4) — reuses the site's existing
 * waitlist form, tagged source: 'blog' so blog-driven signups are
 * attributable in /admin.
 */
export async function BlogCtaBand() {
  const site = await getSiteSettings();
  return (
    <section
      aria-label="Join the movement"
      className="sketch-border mt-20 border-2 border-ink/60 bg-dawn px-8 py-12"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <Doodle className="block w-32 text-ink">
          <SunriseDoodle title="The sun rising over the horizon" />
        </Doodle>
        <h2>Enjoyed this? Be part of it.</h2>
        <p className="max-w-xl text-lg leading-relaxed">
          Sapiens launches across India in 2026. Join the people building a
          society where helping each other is the default.
        </p>
        <div className="flex w-full justify-center">
          <WaitlistForm source="blog" cities={site.cities} />
        </div>
      </div>
    </section>
  );
}
