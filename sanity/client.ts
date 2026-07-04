import { createClient } from "next-sanity";

/*
 * Server-side Sanity client. Only import this from server components and
 * route handlers — the read token must never reach the browser.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "sqbrcyhy";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-06-01",
  useCdn: true,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN,
});
