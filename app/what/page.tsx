import type { Metadata } from "next";

export const metadata: Metadata = { title: "What Sapiens is" };

/* Stub — full page arrives in build stage 3 (spec §7 /what). */
export default function WhatPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1>The anti-social-network. Built for real life.</h1>
      <p className="text-lg leading-relaxed">
        No profiles to scroll. No feeds to get lost in. No money changing
        hands.
      </p>
      <p className="text-sm opacity-70">The full page is being written.</p>
    </section>
  );
}
