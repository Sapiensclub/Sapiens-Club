"use client";

import { useState } from "react";
import { Button } from "@/components/buttons";

/*
 * Contact form (spec §7 /contact) → POST /api/contact.
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          website: (form.get("website") as string) || "",
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="max-w-md text-lg leading-relaxed">
        <span className="font-display text-2xl font-bold">Got it.</span>
        <br />
        Your message is with us — a real human will reply soon.
      </p>
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

      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <Button type="submit" className="self-start" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send it"}
      </Button>
      {status === "error" && (
        <p role="alert" className="text-sm font-semibold text-clay">
          Something wobbled. Try once more?
        </p>
      )}
    </form>
  );
}
