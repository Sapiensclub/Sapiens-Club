import { defineField, defineType } from "sanity";

/*
 * Sanity schemas (spec §9). Everything the owner edits lives here.
 * Publish in the studio → the revalidate webhook makes it live in seconds.
 */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "taglineVision", title: "Vision tagline", type: "string" }),
    defineField({ name: "taglineHook", title: "Hook tagline", type: "string" }),
    defineField({ name: "launchLine", title: "Launch line", type: "string" }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      description: "Shown in the footer and on /contact. Change to hello@sapiens.club here when ready.",
    }),
    defineField({
      name: "volunteerFormUrl",
      title: "Founding volunteer form URL",
      type: "string",
      description:
        "Must be the PUBLIC Google Form link (Send → link icon → ends in /viewform). Leave as # until you have it.",
    }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
    defineField({ name: "youtubeUrl", title: "YouTube URL", type: "url" }),
    defineField({ name: "twitterUrl", title: "X (Twitter) URL", type: "url" }),
    defineField({
      name: "marqueeItems",
      title: "Hero marquee lines",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "cities",
      title: "Waitlist cities",
      type: "array",
      of: [{ type: "string" }],
      description: "Keep 'Other' as the last entry.",
    }),
    defineField({
      name: "announcement",
      title: "Announcement banner (optional)",
      type: "string",
      description: "Shown at the very top of every page when filled in. Leave empty to hide.",
    }),
  ],
});

export const campaignBanner = defineType({
  name: "campaignBanner",
  title: "Campaign banner",
  type: "document",
  description:
    "Promotional banner at the very top of the homepage. Hidden unless enabled.",
  fields: [
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      initialValue: false,
      description: "Master switch. Off = no banner, homepage starts on the hero.",
    }),
    defineField({
      name: "mode",
      title: "Mode",
      type: "string",
      options: { list: ["bar", "large"], layout: "radio" },
      initialValue: "bar",
      description: "bar = slim strip · large = full promotional block with image",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (r) => r.required().warning("The banner needs a headline to show."),
    }),
    defineField({
      name: "subtext",
      title: "Subtext (large mode)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "image",
      title: "Image (large mode, optional)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "ctaLabel", title: "Button label (optional)", type: "string" }),
    defineField({ name: "ctaUrl", title: "Button URL", type: "url", validation: (r) => r.uri({ allowRelative: true }) }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
      options: { list: ["spark", "indigo", "paper"], layout: "radio" },
      initialValue: "spark",
    }),
    defineField({
      name: "dismissible",
      title: "Dismissible",
      type: "boolean",
      initialValue: true,
      description: "Visitors can close it; their choice is remembered until the banner is next edited.",
    }),
    defineField({
      name: "startDate",
      title: "Start showing (optional)",
      type: "datetime",
    }),
    defineField({
      name: "endDate",
      title: "Stop showing (optional)",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "headline", subtitle: "mode", enabled: "enabled" },
    prepare: ({ title, subtitle, enabled }) => ({
      title: title || "(no headline)",
      subtitle: `${enabled ? "ON" : "off"} · ${subtitle}`,
    }),
  },
});

export const minimalHero = defineType({
  name: "minimalHero",
  title: "Minimal hero (top of homepage)",
  type: "document",
  fields: [
    defineField({
      name: "wordmark",
      title: "Wordmark",
      type: "string",
      initialValue: "Sapiens",
    }),
    defineField({
      name: "tagline",
      title: "Tagline (optional, one short line)",
      type: "string",
      description:
        "Keep it short and distinct from the vision line in the section below.",
    }),
    defineField({
      name: "ctaLabel",
      title: "Button label",
      type: "string",
      initialValue: "Join the movement",
    }),
    defineField({
      name: "logo",
      title: "Logo (optional override)",
      type: "image",
      description:
        "Leave empty to use the built-in footprint-S (recommended — it adapts to night mode).",
    }),
  ],
  preview: {
    select: { title: "wordmark", subtitle: "tagline" },
  },
});

export const homeSection = defineType({
  name: "homeSection",
  title: "Home section",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Section",
      type: "string",
      options: {
        list: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        "S1's headline is not overridable here (the orange circle around 'helping' is hand-placed in code).",
    }),
    defineField({ name: "subheading", title: "Subheading", type: "text", rows: 3 }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "extras",
      title: "Extra labels / CTA text",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "key", type: "string" }),
            defineField({ name: "value", type: "string" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "key", subtitle: "heading" },
  },
});

export const story = defineType({
  name: "story",
  title: "Story (S5 · Real moments)",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", type: "text", rows: 5, validation: (r) => r.required() }),
    defineField({ name: "city", type: "string" }),
    defineField({
      name: "doodleKey",
      title: "Doodle illustration",
      type: "string",
      options: {
        list: ["ride", "tiffin", "shield", "umbrella", "highfive", "heart", "plane"],
      },
      initialValue: "heart",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (Phase 2 — real story interviews)",
      type: "url",
    }),
    defineField({
      name: "isReal",
      title: "Is this a real story?",
      type: "boolean",
      initialValue: false,
      description: "Keep false until the app is live. Honesty is non-negotiable.",
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
});

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ item",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
});

export const milestone = defineType({
  name: "milestone",
  title: "Milestone",
  type: "document",
  fields: [
    defineField({ name: "helps", type: "number", validation: (r) => r.required() }),
    defineField({ name: "label", type: "string" }),
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Helps", name: "helps", by: [{ field: "helps", direction: "asc" }] },
  ],
});

export const journeyStage = defineType({
  name: "journeyStage",
  title: "Journey stage (S6 · Celestial)",
  type: "document",
  fields: [
    defineField({ name: "threshold", title: "Helps threshold", type: "number", validation: (r) => r.required() }),
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Threshold", name: "threshold", by: [{ field: "threshold", direction: "asc" }] },
  ],
});

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      type: "string",
      options: { list: ["why", "what", "how", "club-extras"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "object",
          name: "pullQuote",
          title: "Pull quote",
          fields: [defineField({ name: "text", type: "text", rows: 3 })],
        },
        {
          type: "object",
          name: "doodle",
          title: "Doodle",
          fields: [
            defineField({
              name: "doodleKey",
              type: "string",
              options: { list: ["cloud", "sun", "heart", "shield", "sparkle", "plane"] },
            }),
          ],
        },
      ],
    }),
  ],
  preview: { select: { title: "slug", subtitle: "title" } },
});

export const shopTeaseItem = defineType({
  name: "shopTeaseItem",
  title: "Shop tease item",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "doodleKey",
      type: "string",
      options: { list: ["tee", "mug", "tote"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "stampText", type: "string", initialValue: "Not for sale — yet" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
});

export const schemaTypes = [
  siteSettings,
  campaignBanner,
  minimalHero,
  homeSection,
  story,
  faqItem,
  milestone,
  journeyStage,
  page,
  shopTeaseItem,
];
