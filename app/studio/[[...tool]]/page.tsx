import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/*
 * The admin panel (spec §9). Sanity handles login — invite the owner's
 * email in sanity.io/manage → project → Members. Requires the site origin
 * to be added under API → CORS origins (with credentials).
 */
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
