import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Doodle } from "@/components/doodles/doodle";
import { CloudB, HeartDoodle, SunDoodle } from "@/components/doodles/basics";

export const metadata: Metadata = {
  title: "Why Sapiens exists",
  description:
    "The strange sadness of the best times, what money did to helping, and our answer: a society where helping each other is the default.",
};

/*
 * /why — the manifesto (spec §7). Long-form essay, 65ch measure,
 * pull-quotes in Cabin Sketch, doodle margin art.
 */
function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="font-display my-10 border-l-4 border-spark pl-6 text-2xl font-bold leading-snug md:text-3xl">
      {children}
    </blockquote>
  );
}

export default function WhyPage() {
  return (
    <article className="relative mx-auto max-w-[65ch] px-6 py-20 text-lg leading-relaxed">
      <Doodle className="absolute -top-2 right-8 w-20 opacity-40">
        <CloudB />
      </Doodle>

      <h1>Why Sapiens exists</h1>

      <h2 className="mt-14 !text-3xl">The strange sadness of the best times</h2>
      <p className="mt-6">
        By almost every measure, this is the most comfortable moment in human
        history. Food arrives at the door. Rides appear at the kerb. Any fact,
        any film, any person&apos;s highlight reel — one tap away. And yet,
        ask around honestly and you&apos;ll hear the same quiet confession:
        something is missing.
      </p>
      <p className="mt-4">
        We are social creatures. Not as a slogan — as biology. We need
        environments we can trust: streets where a stranger&apos;s face is a
        comfort rather than a warning, neighbourhoods where asking for help
        is normal and offering it is unremarkable. That environment has been
        thinning for a generation. Trust between strangers has worn down.
        Warmth has become something we consume on screens instead of
        something we practise on footpaths.
      </p>
      <PullQuote>
        Comfort everywhere. Company nowhere. That is the strange sadness of
        the best times.
      </PullQuote>

      <h2 className="mt-14 !text-3xl">When money became the measure</h2>
      <p className="mt-6">
        Somewhere along the way, money stopped being just a tool and became
        the measure of nearly everything — including care. Help became a
        service. Kindness got a price tag. If you can pay, the whole city
        works for you; if you can&apos;t, the city walks past.
      </p>
      <p className="mt-4">
        Money is the universal fuel, and it should keep being one. But it
        cannot be the <em>only</em> key to a good life. A society where the
        people who quietly improve it — the ones who show up, teach, carry,
        cook, listen — are supported and celebrated beyond what their bank
        balance says: that is not a utopia. It is a design choice. Nobody
        made it yet.
      </p>

      <Doodle className="my-8 block w-16 text-ink">
        <HeartDoodle title="A hand-drawn heart" />
      </Doodle>

      <h2 className="mt-6 !text-3xl">Our answer</h2>
      <p className="mt-6">
        Sapiens is help without profiles, without status, without payment.
        You ask; someone nearby shows up. You offer; someone nearby is
        relieved. No feed to perform on. No follower count to grow. No bill
        at the end.
      </p>
      <p className="mt-4">
        When A helps B, they may never meet again — and that&apos;s fine,
        because someday Z will help B, and B will help someone else&apos;s A.
        Help doesn&apos;t travel in straight lines. It compounds, the way
        trust always has: one act at a time, until a whole city believes in
        itself again.
      </p>

      <PullQuote>
        <strong>Vision:</strong> A society where human values, trust and care
        for each other are prevalent — not just in words, but in action.
      </PullQuote>
      <PullQuote>
        <strong>Mission:</strong> To empower one billion people in five years
        with the tools, motivation and environment to practice their true
        nature: helping others.
      </PullQuote>

      <div className="mt-14 flex flex-col items-start gap-4">
        <Doodle className="w-16 text-ink">
          <SunDoodle title="A hand-drawn sun" />
        </Doodle>
        <p>If any of this feels like yours, it is. Come build it.</p>
        <ButtonLink href="/club">Join the first thousand</ButtonLink>
      </div>
    </article>
  );
}
