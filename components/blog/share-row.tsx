"use client";

import { useState } from "react";

/*
 * Share row (Blog Build Spec §4): X, WhatsApp, LinkedIn, Facebook, Copy
 * link. No reader accounts, no third-party share SDKs — plain intent URLs,
 * so nothing is loaded from those companies until the visitor clicks.
 */
function shareLinks(url: string, title: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { label: "X", href: `https://x.com/intent/tweet?text=${t}&url=${u}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ];
}

export function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return; // clipboard blocked — stay silent rather than lie
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const cls =
    "sketch-border border-2 border-ink/50 px-4 py-1.5 text-sm font-bold transition hover:border-spark hover:text-clay";

  return (
    <div className="mt-14 flex flex-wrap items-center gap-3">
      <span className="text-sm font-bold opacity-70">Share this</span>
      {shareLinks(url, title).map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
        >
          {label}
        </a>
      ))}
      <button type="button" onClick={copy} className={cls}>
        {copied ? "Copied ✓" : "Copy link"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
