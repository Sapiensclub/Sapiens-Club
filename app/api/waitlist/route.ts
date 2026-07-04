import { NextRequest, NextResponse } from "next/server";
import { waitlistEmailOnlySchema } from "@/lib/validators";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/ratelimit";
import { sendWaitlistConfirmation, notifyOwner } from "@/lib/resend";

/*
 * POST /api/waitlist (spec §11).
 * - honeypot filled → 200, silently do nothing
 * - rate-limited 5/min/IP (skipped if Upstash not configured)
 * - duplicate email → generic success (never reveal existing signups)
 * - new signup → confirmation email to subscriber + owner notification
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const parsed = waitlistEmailOnlySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }
  const { email, phone, city, source, website } = parsed.data;

  // honeypot: pretend success, store nothing
  if (website) return NextResponse.json({ ok: true });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkRateLimit(`waitlist:${ip}`))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const db = supabaseAdmin();
  if (!db) {
    console.error("[waitlist] Supabase env vars missing");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const { error } = await db.from("waitlist").insert({
    email,
    phone: phone || null,
    city: city || null,
    source,
    consent: true,
  });

  if (error) {
    // 23505 = unique violation: already subscribed → generic success
    if (error.code === "23505") return NextResponse.json({ ok: true });
    console.error("[waitlist] insert failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // fire-and-forget emails — a failed email must not fail the signup
  await Promise.allSettled([
    sendWaitlistConfirmation(email),
    notifyOwner("New waitlist signup", { email, phone, city, source }),
  ]);

  return NextResponse.json({ ok: true });
}
