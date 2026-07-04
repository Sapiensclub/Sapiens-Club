import type { Metadata } from "next";

export const metadata: Metadata = { title: "The Sapiens Club" };

/* Stub — full page arrives in build stage 3 (spec §7 /club). */
export default function ClubPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1>The first thousand.</h1>
      <p className="text-lg leading-relaxed">
        The ones who believed before there was an app to believe in.
      </p>
      <p className="text-sm opacity-70">The full page is being written.</p>
    </section>
  );
}
