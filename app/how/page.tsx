import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/buttons";
import { Doodle } from "@/components/doodles/doodle";
import {
  PaperPlane,
  SparkleA,
  HeartDoodle,
  ShieldDoodle,
} from "@/components/doodles/basics";
import { PeopleFacing, HighFive } from "@/components/doodles/vignettes";

export const metadata: Metadata = {
  title: "How Sapiens works — five steps, zero rupees",
  description:
    "Ask, nearby Sapiens are pinged, someone shows up, help happens and Moneta is earned, you choose to connect. Plus safety, in full.",
};

/*
 * /how — the five steps expanded, then Safety, in full (spec §7).
 */
const STEPS = [
  {
    title: "Ask.",
    Art: PaperPlane,
    body: "Raise a request — a ride, a meal, a game of badminton, a helping hand. It takes under a minute: what you need, roughly when, roughly where. No justifying, no bargaining, no price. Asking for help is the bravest button in the app, and we've made it the simplest.",
  },
  {
    title: "Nearby Sapiens are pinged.",
    Art: SparkleA,
    body: "Your request doesn't get broadcast to a feed — Sapiens has no feed. It quietly reaches only the people nearby who already said they like helping with exactly this kind of thing. If you offered rides, you hear about rides. No noise for anyone else, no performance for anyone at all.",
  },
  {
    title: "Someone shows up.",
    Art: PeopleFacing,
    body: "Before anyone arrives, you see who's coming — photo-verified, like your cab app, in both directions. They see who asked, you see who answered. Two real names, two real faces, one small plan. Most helps are done and dusted within the hour.",
  },
  {
    title: "Help happens. Moneta is earned.",
    Art: HighFive,
    body: "The ride happens, the meal lands warm, the shelf gets carried up three floors. The helper earns one Moneta — our token of goodness. It's earned, never bought, and no money changes hands between people. Ever. Later, Moneta will be redeemable for good things; its real value is what it says about you.",
  },
  {
    title: "You choose to connect.",
    Art: HeartDoodle,
    body: "When the help ends, nothing is owed and nothing is automatic. If you both want to stay in touch, you both say so — and a real friendship begins, founded on a real act instead of a follow button. If not, you part as two people who made one day slightly better.",
  },
];

const SAFETY = [
  {
    title: "Who can join",
    body: "An email and phone number with OTP lets you look around. But before anyone can give or receive help, they complete government-ID KYC — Aadhaar or Driving Licence. Verification isn't a hurdle. It's the foundation.",
  },
  {
    title: "Photo verification",
    body: "Like your cab app: you see who's coming, they see who asked. Every meetup starts with two faces both sides have already seen.",
  },
  {
    title: "Under 18",
    body: "Under-18s get a separate child mode with group-only connections — no one-to-one meetings with unknown adults, full stop.",
  },
  {
    title: "Ratings, feedback & complaints",
    body: "Both sides rate after every help — text or voice, whichever is easier. A complaint system with human review sits behind it, and patterns are acted on, not archived.",
  },
  {
    title: "SOS",
    body: "One press alerts nearby Sapiens and the local police station with your location. Built for the moment we hope never comes.",
  },
  {
    title: "Your data",
    body: "We don't sell it. We don't show you ads. We collect the minimum and guard it like it's ours — because it's yours.",
  },
];

export default function HowPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-center">Five steps. Zero rupees.</h1>

      <ol className="mt-16 space-y-14">
        {STEPS.map(({ title, body, Art }, idx) => (
          <li key={title} className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <div className="flex shrink-0 items-start gap-4 sm:flex-col sm:items-center">
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-full bg-spark font-display text-xl font-bold text-ink"
              >
                {idx + 1}
              </span>
              <Doodle className="h-14 w-16 text-ink">
                <Art className="h-full w-full" />
              </Doodle>
            </div>
            <div>
              <h2 className="!text-2xl">{title}</h2>
              <p className="mt-3 leading-relaxed">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-24">
        <div className="flex items-center gap-4">
          <Doodle className="w-12 text-ink">
            <ShieldDoodle title="A hand-drawn shield" />
          </Doodle>
          <h2>Safety, in full</h2>
        </div>
        <div className="mt-10 space-y-10">
          {SAFETY.map(({ title, body }) => (
            <div key={title}>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-2 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 font-display text-2xl font-bold">
          Trust isn&apos;t a feature. It&apos;s the whole point.
        </p>
      </section>

      <section className="mt-20 text-center">
        <p className="text-lg">
          Still curious? The{" "}
          <Link
            href="/contact"
            className="font-bold underline decoration-spark decoration-2 underline-offset-4"
          >
            FAQ
          </Link>{" "}
          answers the ten questions everyone asks.
        </p>
        <div className="mt-8">
          <ButtonLink href="/club">Be one of the first</ButtonLink>
        </div>
      </section>
    </div>
  );
}
