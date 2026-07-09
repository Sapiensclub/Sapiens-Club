import { defineField, defineType } from "sanity";

/*
 * BLOG SCHEMAS (Blog Build Spec §2–§3). Self-contained: this file plus the
 * three-line registration in ./index.ts are the only schema touch-points,
 * so the blog can be removed cleanly later (spec §8).
 *
 * author.social powers BOTH the visible bio links AND the Person
 * structured-data `sameAs` array (the E-E-A-T authority mechanism).
 */

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "avatar", type: "image", options: { hotspot: true } }),
    defineField({
      name: "role",
      type: "string",
      title: "Role / title",
      description: 'e.g. "Founder, Sapiens"',
    }),
    defineField({ name: "bio", type: "text", rows: 4, title: "Short bio" }),
    defineField({
      name: "credentials",
      type: "string",
      title: "Expertise / credentials (one line)",
    }),
    defineField({
      name: "social",
      title: "Social & professional profiles",
      description:
        "Shown on the author page AND emitted as sameAs in structured data — this is the authority signal.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: {
                list: ["Instagram", "X", "LinkedIn", "YouTube", "Website", "Other"],
              },
            }),
            defineField({ name: "url", type: "url" }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "avatar" } },
});

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      title: "Description (used on the category page + meta description)",
    }),
  ],
});

/* an image with required alt + optional caption — used standalone and in
   the gallery */
const capturedImage = {
  type: "image" as const,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      type: "string",
      title: "Alt text (describe the image)",
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", type: "string", title: "Caption (optional)" }),
  ],
};

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      title: "Excerpt / summary (cards + meta description fallback)",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      ...capturedImage,
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      validation: (r) => r.required(),
      description: "Posts only appear once this date is in the past.",
    }),
    defineField({
      name: "updatedAt",
      type: "datetime",
      title: "Last updated (for dateModified)",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Feature on blog home",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        /* rich text: h2–h4, lists, blockquote, bold/italic, links */
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullets", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    title: "URL (internal like /why or external)",
                    validation: (r) =>
                      r.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
                  }),
                ],
              },
            ],
          },
        },
        /* captioned image */
        { name: "bodyImage", title: "Image", ...capturedImage },
        /* gallery */
        {
          type: "object",
          name: "gallery",
          title: "Image gallery",
          fields: [
            defineField({
              name: "images",
              type: "array",
              of: [{ name: "galleryImage", title: "Image", ...capturedImage }],
              validation: (r) => r.min(2),
            }),
          ],
          preview: {
            select: { images: "images" },
            prepare: ({ images }) => ({
              title: `Gallery — ${images?.length ?? 0} images`,
            }),
          },
        },
        /* video embed (YouTube etc.) */
        {
          type: "object",
          name: "videoEmbed",
          title: "Video embed",
          fields: [
            defineField({
              name: "url",
              type: "url",
              title: "Video URL (YouTube link works best)",
              validation: (r) => r.required(),
            }),
            defineField({ name: "caption", type: "string", title: "Caption (optional)" }),
          ],
          preview: { select: { title: "url", subtitle: "caption" } },
        },
        /* pull-quote */
        {
          type: "object",
          name: "pullQuote",
          title: "Pull quote",
          fields: [
            defineField({ name: "text", type: "text", rows: 3, validation: (r) => r.required() }),
            defineField({ name: "attribution", type: "string", title: "Attribution (optional)" }),
          ],
          preview: { select: { title: "text", subtitle: "attribution" } },
        },
        /* callout */
        {
          type: "object",
          name: "callout",
          title: "Callout box",
          fields: [
            defineField({
              name: "tone",
              type: "string",
              options: { list: ["info", "tip", "warning"], layout: "radio" },
              initialValue: "info",
            }),
            defineField({ name: "title", type: "string", title: "Title (optional)" }),
            defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title", subtitle: "tone" } },
        },
        /* key takeaways */
        {
          type: "object",
          name: "keyTakeaways",
          title: "Key takeaways",
          fields: [
            defineField({ name: "title", type: "string", initialValue: "Key takeaways" }),
            defineField({
              name: "items",
              type: "array",
              of: [{ type: "string" }],
              validation: (r) => r.min(1),
            }),
          ],
          preview: {
            select: { title: "title", items: "items" },
            prepare: ({ title, items }) => ({
              title: title || "Key takeaways",
              subtitle: `${items?.length ?? 0} points`,
            }),
          },
        },
        /* in-article FAQ (also emits FAQPage structured data) */
        {
          type: "object",
          name: "faq",
          title: "FAQ",
          fields: [
            defineField({
              name: "items",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
                    defineField({ name: "answer", type: "text", rows: 3, validation: (r) => r.required() }),
                  ],
                  preview: { select: { title: "question" } },
                },
              ],
              validation: (r) => r.min(1),
            }),
          ],
          preview: {
            select: { items: "items" },
            prepare: ({ items }) => ({ title: `FAQ — ${items?.length ?? 0} questions` }),
          },
        },
        /* hand-drawn divider */
        {
          type: "object",
          name: "divider",
          title: "Doodle divider",
          fields: [
            defineField({
              name: "style",
              type: "string",
              options: { list: ["sparkle", "footsteps", "cloud"], layout: "radio" },
              initialValue: "sparkle",
            }),
          ],
          preview: { select: { subtitle: "style" }, prepare: (s) => ({ title: "— divider —", subtitle: String(s.subtitle ?? "") }) },
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO overrides (optional)",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "metaTitle", type: "string" }),
        defineField({ name: "metaDescription", type: "text", rows: 2 }),
        defineField({
          name: "ogImage",
          type: "image",
          title: "Social share image (defaults to cover image)",
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "excerpt",
      media: "coverImage",
      publishedAt: "publishedAt",
    },
    prepare: ({ title, media, publishedAt }) => ({
      title,
      subtitle: publishedAt
        ? new Date(publishedAt) > new Date()
          ? `⏳ scheduled ${publishedAt.slice(0, 10)}`
          : publishedAt.slice(0, 10)
        : "no publish date",
      media,
    }),
  },
});

export const blogSchemaTypes = [author, category, blogPost];
