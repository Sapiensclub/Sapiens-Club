import type { Metadata } from "next";

export const metadata: Metadata = { title: "The Sapiens Shop" };

/* Stub — the shop tease arrives in build stage 3 (spec §7 /shop). */
export default function ShopPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1>First we build the community. Then we wear it.</h1>
      <p className="text-lg leading-relaxed">
        The Sapiens Shop opens after launch. Every rupee it makes flows
        straight back into the community — always.
      </p>
    </section>
  );
}
