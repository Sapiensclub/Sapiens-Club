import type { Metadata } from "next";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import { Doodle } from "@/components/doodles/doodle";
import { ToteBag } from "@/components/doodles/basics";
import { TeeDoodle, MugDoodle } from "@/components/doodles/extras";

export const metadata: Metadata = {
  title: "The Sapiens Shop — not for sale, yet",
  description:
    "First we build the community. Then we wear it. The Sapiens Shop opens after launch; every rupee flows back into the community.",
};

/*
 * /shop — the tease (spec §7): three doodle products rubber-stamped
 * NOT FOR SALE — YET. Stamp rotate-in on scroll comes in stage 6.
 */
const PRODUCTS = [
  { name: "The Sapiens tee", Art: TeeDoodle },
  { name: "The morning mug", Art: MugDoodle },
  { name: "The everyday tote", Art: ToteBag },
];

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h1>First we build the community. Then we wear it.</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
        The Sapiens Shop opens after launch. Every rupee it makes flows
        straight back into the community — always.
      </p>

      <div className="mt-16 grid gap-10 sm:grid-cols-3">
        {PRODUCTS.map(({ name, Art }, idx) => (
          <div key={name} className="relative flex flex-col items-center gap-4">
            <Doodle className="h-32 w-32 text-ink" delay={idx * 150}>
              <Art className="h-full w-full" title={name} />
            </Doodle>
            <span
              aria-hidden
              className="absolute top-6 -rotate-12 border-[3px] border-clay px-3 py-1 font-display text-sm font-bold tracking-widest text-clay uppercase"
            >
              Not for sale — yet
            </span>
            <p className="font-bold">{name}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-center gap-4">
        <p className="text-lg font-bold">Tell me when it opens</p>
        <WaitlistForm source="shop" emailOnly buttonLabel="Tell me when it opens" />
      </div>
    </div>
  );
}
