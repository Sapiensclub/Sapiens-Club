import type { Metadata } from "next";

export const metadata: Metadata = { title: "Why Sapiens exists" };

/* Stub — full manifesto page arrives in build stage 3 (spec §7 /why). */
export default function WhyPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1>Why Sapiens exists</h1>
      <p className="text-lg leading-relaxed">
        A society where human values, trust and care for each other are
        prevalent — not just in words, but in action.
      </p>
      <p className="text-sm opacity-70">The full story is being written.</p>
    </section>
  );
}
