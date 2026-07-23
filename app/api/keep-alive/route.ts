import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/*
 * Keep-alive (added after the DB auto-paused, July 2026).
 *
 * Supabase's free tier pauses a project after ~7 days with no activity —
 * which silently breaks the waitlist form and the /admin panel until it's
 * manually restored. This endpoint runs a trivial query so the project
 * never counts as idle. Vercel Cron hits it daily (see vercel.json).
 *
 * It only reads a row count (no data returned), so it's harmless if called
 * by anyone. If CRON_SECRET is set in the environment, we require Vercel's
 * bearer header; if not, it stays open so the cron works out of the box.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  const db = supabaseAdmin();
  if (!db) {
    return NextResponse.json({ ok: false, reason: "no-db-config" }, { status: 500 });
  }

  const { error } = await db
    .from("waitlist")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("[keep-alive] db unreachable:", error.message);
    return NextResponse.json({ ok: false, reason: "db-unreachable" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, pinged: new Date().toISOString() });
}
