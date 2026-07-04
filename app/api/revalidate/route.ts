import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/*
 * Sanity webhook target (spec §9/§11). Configure in sanity.io/manage →
 * project → API → Webhooks:
 *   URL:    https://sapiens.club/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 *   Trigger: create, update, delete
 * Publishing in the studio then refreshes the live site within seconds.
 */
export async function POST(req: NextRequest) {
  const secret =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("sanity-webhook-secret");

  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidateTag("content");
  return NextResponse.json({ ok: true, revalidated: "content" });
}
