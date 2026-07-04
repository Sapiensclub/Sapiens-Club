import { S1Hero } from "@/components/sections/s1-hero";
import { S2Ache } from "@/components/sections/s2-ache";
import { S3Idea } from "@/components/sections/s3-idea";
import { S4How } from "@/components/sections/s4-how";
import { S5Moments } from "@/components/sections/s5-moments";
import { S6Celestial } from "@/components/sections/s6-celestial";
import { S7Movement } from "@/components/sections/s7-movement";
import { S8Join } from "@/components/sections/s8-join";
import { S9Closing } from "@/components/sections/s9-closing";

/*
 * Home — S1–S9 (spec §6). Background choreography paper→night→dawn
 * currently approximated with per-section backgrounds; stage 7 replaces
 * it with one GSAP timeline animating the body background across scroll.
 */
export default function Home() {
  return (
    <>
      <S1Hero />
      <S2Ache />
      <S3Idea />
      <S4How />
      <S5Moments />
      <S6Celestial />
      <S7Movement />
      <S8Join />
      <S9Closing />
    </>
  );
}
