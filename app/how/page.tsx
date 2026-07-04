import type { Metadata } from "next";

export const metadata: Metadata = { title: "How Sapiens works" };

/* Stub — full page arrives in build stage 3 (spec §7 /how). */
export default function HowPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1>Five steps. Zero rupees.</h1>
      <p className="text-lg leading-relaxed">
        Trust isn&apos;t a feature. It&apos;s the whole point.
      </p>
      <p className="text-sm opacity-70">The full page is being written.</p>
    </section>
  );
}
