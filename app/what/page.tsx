import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Doodle } from "@/components/doodles/doodle";
import { CheckMark, CrossMark } from "@/components/doodles/extras";
import { getPageWhat } from "@/sanity/content";

export const metadata: Metadata = {
  title: "What Sapiens is — the anti-social-network",
  description:
    "No ads, no feeds, no follower counts, no money. Real requests, real meetings, real safety, real friendship — measured in light, not likes.",
};

/*
 * /what — the anti-social-network (spec §7). Editable in the studio
 * ("Pages → What"); the constants below are the fallbacks.
 */
const HEADING = "The anti-social-network. Built for real life.";
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

const KINDNESS_HEADING = "One app, many kindnesses";
const KINDNESS_INTRO =
  "Sometimes helping looks like a ride. Sometimes a meal, a lesson, a game, a donated bookshelf, an SOS answered at midnight. Sapiens holds them all — food, knowledge, time, things, travel, safety.";
const KINDNESS_CHIPS = ["Food", "Knowledge", "Time", "Things", "Travel", "Safety"];
const CLOSING =
  "And when a help ends, nothing is owed. If you both felt it — the conversation that didn't want to stop, the laugh on the doorstep — you choose to stay connected. Friendship on Sapiens isn't requested. It's earned, once, in person, for real.";

export default async function WhatPage() {
  const cms = await getPageWhat();
  const heading = cms?.heading || HEADING;
  const weDont = cms?.weDont?.length ? cms.weDont : WE_DONT;
  const weDo = cms?.weDo?.length ? cms.weDo : WE_DO;
  const kindnessHeading = cms?.kindnessHeading || KINDNESS_HEADING;
  const kindnessIntro = cms?.kindnessIntro || KINDNESS_INTRO;
  const chips = cms?.kindnessChips?.length ? cms.kindnessChips : KINDNESS_CHIPS;
  const closing = cms?.closing || CLOSING;

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-center">{heading}</h1>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="!text-3xl">We don&apos;t</h2>
          <ul className="mt-6 space-y-4">
            {weDont.map((line, idx) => (
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
            {weDo.map((line, idx) => (
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
        <h2>{kindnessHeading}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
          {kindnessIntro}
        </p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {chips.map((chip) => (
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
          {closing}
        </p>
        <div className="mt-10">
          <ButtonLink href="/club">Be one of the first</ButtonLink>
        </div>
      </section>
    </div>
  );
}
