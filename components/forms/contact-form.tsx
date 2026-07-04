"use client";

import { useState } from "react";
import { Button } from "@/components/buttons";
import { site } from "@/lib/site";

/*
 * Contact form (spec §7 /contact): name · email · message.
 * TODO(stage 5): POST to /api/contact (insert + Resend notification).
 * Until then the submit points people to the direct email — honestly.
 */
export function ContactForm() {
  const [note, setNote] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNote(
      `This form goes live in a few days — meanwhile, write to ${site.contactEmail} and a real human will reply.`
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4 text-left">
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className="text-sm font-bold">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="sketch-border border-2 border-ink bg-paper px-4 py-2.5"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="text-sm font-bold">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="sketch-border border-2 border-ink bg-paper px-4 py-2.5"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-sm font-bold">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="sketch-border border-2 border-ink bg-paper px-4 py-2.5"
        />
      </div>

      {/* honeypot (used in stage 5) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <Button type="submit" className="self-start">
        Send it
      </Button>
      {note && (
        <p role="status" className="text-sm font-semibold text-clay">
          {note}
        </p>
      )}
    </form>
  );
}
