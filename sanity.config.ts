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

const SINGLETONS = ["siteSettings", "campaignBanner", "minimalHero"];

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
            S.listItem()
              .title("Site settings")
              .id("siteSettings")
              .child(
                S.document().schemaType("siteSettings").documentId("siteSettings")
              ),
            S.listItem()
              .title("Campaign banner")
              .id("campaignBanner")
              .child(
                S.document()
                  .schemaType("campaignBanner")
                  .documentId("campaignBanner")
              ),
            S.listItem()
              .title("Minimal hero")
              .id("minimalHero")
              .child(
                S.document().schemaType("minimalHero").documentId("minimalHero")
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !SINGLETONS.includes(item.getId() ?? "")
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // don't offer "create new" for singletons
    templates: (templates) =>
      templates.filter((t) => !SINGLETONS.includes(t.schemaType)),
  },
});
