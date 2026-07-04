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

const SINGLETON = "siteSettings";

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
              .id(SINGLETON)
              .child(
                S.document().schemaType(SINGLETON).documentId(SINGLETON)
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== SINGLETON
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // don't offer "create new site settings" — it's a singleton
    templates: (templates) =>
      templates.filter((t) => t.schemaType !== SINGLETON),
  },
});
