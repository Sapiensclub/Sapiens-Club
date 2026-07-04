import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact Sapiens" };

/* Stub — contact form + FAQ arrive in build stages 3–5 (spec §7 /contact). */
export default function ContactPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1>Say hello</h1>
      <p className="text-lg leading-relaxed">
        Write to us at{" "}
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-bold underline decoration-spark decoration-2 underline-offset-4"
        >
          {site.contactEmail}
        </a>
        . A real human reads every message.
      </p>
    </section>
  );
}
