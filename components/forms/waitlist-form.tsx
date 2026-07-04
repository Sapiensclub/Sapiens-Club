"use client";

import { useState } from "react";
import { Button } from "@/components/buttons";
import { CitySelect } from "@/components/city-select";
import { LogoMark } from "@/components/logo";

/*
 * Waitlist form (spec §6-S8 Tier 1) → POST /api/waitlist.
 * Success: the form morphs into the footprint-S with a welcome line and
 * a little confetti of doodle sparks. Duplicate signups look identical
 * to new ones (the API never reveals who is already subscribed).
 */
export function WaitlistForm({
  source = "hero",
  emailOnly = false,
  buttonLabel = "Count me in",
  cities,
}: {
  source?: "hero" | "club" | "shop" | "closing";
  emailOnly?: boolean;
  buttonLabel?: string;
  cities?: readonly string[];
}) {
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorNote, setErrorNote] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorNote("");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          phone: (form.get("phone") as string) || "",
          city,
          source,
          consent: true,
          website: (form.get("website") as string) || "",
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorNote(
          res.status === 429
            ? "Whoa — a few too many tries at once. Give it a minute?"
            : "Something wobbled. Try once more?"
        );
      }
    } catch {
      setStatus("error");
      setErrorNote("Something wobbled. Try once more?");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="relative flex w-full max-w-md flex-col items-center gap-4 py-6 text-center"
      >
        {/* confetti of doodle sparks */}
        <span aria-hidden className="confetti">
          {[...Array(6)].map((_, i) => (
            <svg
              key={i}
              viewBox="0 0 32 32"
              className="confetti-spark text-spark"
              style={{ "--ci": i } as React.CSSProperties}
            >
              <path
                fill="currentColor"
                d="M16 3 C17 10 19 14 27 16 C19 18 17 22 16 29 C15 22 13 18 5 16 C13 14 15 10 16 3 Z"
              />
            </svg>
          ))}
        </span>
        <LogoMark className="h-24 w-auto" title="Sapiens footprint logo" />
        <p className="font-display text-2xl font-bold">
          Welcome, Sapiens. We&apos;ll see you at the beginning.
        </p>
      </div>
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

          <CitySelect onChange={setCity} cities={cities} />

          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" required className="mt-1 h-4 w-4 accent-spark" />
            <span>I&apos;d like Sapiens to contact me about the launch.</span>
          </label>
        </>
      )}

      {/* honeypot — bots fill it, humans never see it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <Button type="submit" className="self-start" disabled={status === "sending"}>
        {status === "sending" ? "One moment…" : buttonLabel}
      </Button>

      {status === "error" ? (
        <p role="alert" className="text-sm font-semibold text-clay">
          {errorNote}
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
