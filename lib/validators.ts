import { z } from "zod";

/*
 * Zod schemas for the API routes (spec §11). `website` is the honeypot:
 * humans never see the field, bots fill it — a non-empty value gets a
 * silent 200 and nothing is stored.
 */
export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  phone: z.string().trim().max(32).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  source: z.enum(["hero", "club", "shop", "closing"]).default("hero"),
  consent: z.literal(true),
  website: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(320),
  message: z.string().trim().min(1).max(5000),
  website: z.string().optional(),
});

/* shop signups don't show the consent checkbox — email only */
export const waitlistEmailOnlySchema = waitlistSchema.extend({
  consent: z.boolean().default(true),
});
