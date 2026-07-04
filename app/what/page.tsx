import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Doodle } from "@/components/doodles/doodle";
import { CheckMark, CrossMark } from "@/components/doodles/extras";

export const metadata: Metadata = {
  title: "What Sapiens is — the anti-social-network",
  description:
    "No ads, no feeds, no follower counts, no money. Real requests, real meetings, real safety, real friendship — measured in light, not likes.",
};

/*
 * /what — the anti-social-network (spec §7).
 */
const WE_DONT = [
  "No ads — your attention isn't for sale.",
  "No feeds — nothing to doomscroll.",
  "No follower counts — worth isn't a number.",
  "No strangers' highlight reels.",
  "No money — help can't be bought here.",
];

const WE_DO = [
  "Real requests from real neighbours.",
  "Real meetings, offline, nearby.",
  "Real safety — everyone verified.",
  "Real friendship — chosen after a real act.",
  "Real worth — measured in light, not likes.",
];

const KINDNESS_CHIPS = ["Food", "Knowledge", "Time", "Things", "Travel", "Safety"];

export default function WhatPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-center">
        The anti-social-network. Built for real life.
      </h1>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="!text-3xl">We don&apos;t</h2>
          <ul className="mt-6 space-y-4">
            {WE_DONT.map((line, idx) => (
              <li key={line} className="flex items-start gap-3 text-lg">
                <Doodle className="mt-1 w-5 shrink-0 text-clay" delay={idx * 100}>
                  <CrossMark title="No" />
                </Doodle>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="!text-3xl">We do</h2>
          <ul className="mt-6 space-y-4">
            {WE_DO.map((line, idx) => (
              <li key={line} className="flex items-start gap-3 text-lg">
                <Doodle className="mt-1 w-5 shrink-0 text-spark" delay={idx * 100}>
                  <CheckMark title="Yes" />
                </Doodle>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-24 text-center">
        <h2>One app, many kindnesses</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
          Sometimes helping looks like a ride. Sometimes a meal, a lesson, a
          game, a donated bookshelf, an SOS answered at midnight. Sapiens
          holds them all — food, knowledge, time, things, travel, safety.
        </p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {KINDNESS_CHIPS.map((chip) => (
            <li
              key={chip}
              className="sketch-border border-2 border-ink px-5 py-2 font-display text-lg font-bold"
            >
              {chip}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-24 text-center">
        <p className="mx-auto max-w-2xl text-lg italic leading-relaxed">
          And when a help ends, nothing is owed. If you both felt it — the
          conversation that didn&apos;t want to stop, the laugh on the
          doorstep — you choose to stay connected. Friendship on Sapiens
          isn&apos;t requested. It&apos;s earned, once, in person, for real.
        </p>
        <div className="mt-10">
          <ButtonLink href="/club">Be one of the first</ButtonLink>
        </div>
      </section>
    </div>
  );
}
