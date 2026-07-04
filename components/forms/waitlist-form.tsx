"use client";

import { useState } from "react";
import { Button } from "@/components/buttons";
import { CitySelect } from "@/components/city-select";
import { site } from "@/lib/site";

/*
 * Waitlist form (spec §6-S8 Tier 1). Fields: email (required), phone
 * (optional), city (curated dropdown), consent (required).
 *
 * TODO(stage 5): POST to /api/waitlist (zod-validated, honeypot,
 * rate-limited, Resend confirmation) and morph into the footprint-S
 * success state with doodle-spark confetti. Until that route exists the
 * submit shows an honest "opening soon" note instead of failing silently.
 */
export function WaitlistForm({
  source = "hero",
  emailOnly = false,
  buttonLabel = "Count me in",
}: {
  source?: "hero" | "club" | "shop" | "closing";
  emailOnly?: boolean;
  buttonLabel?: string;
}) {
  const [, setCity] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Stage 5 wires this to /api/waitlist with { email, phone, city, source }.
    setNote(
      "Almost there — the waitlist opens here in a few days. Until then, find us on Instagram."
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-4 text-left"
      data-source={source}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={`email-${source}`} className="text-sm font-bold">
          Email
        </label>
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="sketch-border border-2 border-ink bg-paper px-4 py-2.5"
        />
      </div>

      {!emailOnly && (
        <>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-bold">
              Phone <span className="font-normal opacity-60">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91…"
              className="sketch-border border-2 border-ink bg-paper px-4 py-2.5"
            />
          </div>

          <CitySelect onChange={setCity} />

          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" required className="mt-1 h-4 w-4 accent-spark" />
            <span>I&apos;d like Sapiens to contact me about the launch.</span>
          </label>
        </>
      )}

      {/* honeypot — bots fill it, humans never see it (used in stage 5) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <Button type="submit" className="self-start">
        {buttonLabel}
      </Button>

      {note ? (
        <p role="status" className="text-sm font-semibold text-clay">
          {note}{" "}
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-spark decoration-2 underline-offset-2"
          >
            @sapiens.club_
          </a>
        </p>
      ) : (
        !emailOnly && (
          <p className="text-sm opacity-70">
            No spam. One meaningful email a month, and the day we launch in
            your city.
          </p>
        )
      )}
    </form>
  );
}
