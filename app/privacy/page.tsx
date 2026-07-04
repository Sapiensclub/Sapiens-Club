import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy — Sapiens" };

/* Stub — full plain-English, DPDP-aware policy generated in stage 3 (§7). */
export default function PrivacyPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1>Privacy</h1>
      <p className="text-lg leading-relaxed">
        The short version, which will also be the long version: we collect the
        minimum, we never sell your data, and we show no ads. The full policy
        is being written.
      </p>
    </section>
  );
}
