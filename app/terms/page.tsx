import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms — Sapiens" };

/* Stub — full plain-English terms generated in stage 3 (§7). */
export default function TermsPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1>Terms</h1>
      <p className="text-lg leading-relaxed">
        The full terms of use are being written and will appear here before
        launch.
      </p>
    </section>
  );
}
