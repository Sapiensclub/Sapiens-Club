"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

/*
 * Sanity Studio config — the admin panel mounted at /studio (spec §9).
 * siteSettings is a singleton: one fixed document, always at the top.
 */
/* the project id is public (visible in every browser request) — the
   hardcoded fallback keeps builds working if the env var is missing */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "sqbrcyhy";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/* types managed as fixed documents (no "create new", not in the auto list) */
const MANAGED = [
  "siteSettings",
  "campaignBanner",
  "minimalHero",
  "prosePage",
  "pageWhat",
  "pageHow",
  "pageClub",
  "pageIntro",
];

const fixedDoc = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S: any,
  title: string,
  schemaType: string,
  documentId: string
) =>
  S.listItem()
    .title(title)
    .id(documentId)
    .child(S.document().schemaType(schemaType).documentId(documentId));

export default defineConfig({
  name: "sapiens",
  title: "Sapiens",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            fixedDoc(S, "Site settings", "siteSettings", "siteSettings"),
            fixedDoc(S, "Campaign banner", "campaignBanner", "campaignBanner"),
            fixedDoc(S, "Minimal hero", "minimalHero", "minimalHero"),
            // all inner pages, grouped
            S.listItem()
              .title("Pages")
              .id("pages")
              .child(
                S.list()
                  .title("Pages")
                  .items([
                    fixedDoc(S, "Why (manifesto)", "prosePage", "prosePage.why"),
                    fixedDoc(S, "What", "pageWhat", "pageWhat"),
                    fixedDoc(S, "How", "pageHow", "pageHow"),
                    fixedDoc(S, "Club", "pageClub", "pageClub"),
                    fixedDoc(S, "Contact intro", "pageIntro", "pageIntro.contact"),
                    fixedDoc(S, "Shop intro", "pageIntro", "pageIntro.shop"),
                    fixedDoc(S, "Privacy", "prosePage", "prosePage.privacy"),
                    fixedDoc(S, "Terms", "prosePage", "prosePage.terms"),
                  ])
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item: { getId: () => string | undefined }) =>
                !MANAGED.includes(item.getId() ?? "")
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // don't offer "create new" for the fixed/managed documents
    templates: (templates) =>
      templates.filter((t) => !MANAGED.includes(t.schemaType)),
  },
});
