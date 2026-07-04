import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/ratelimit";
import { notifyOwner } from "@/lib/resend";

/*
 * POST /api/contact (spec §11): validate → honeypot → rate limit →
 * insert → notify owner by email.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }
  const { name, email, message, website } = parsed.data;

  if (website) return NextResponse.json({ ok: true });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkRateLimit(`contact:${ip}`))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const db = supabaseAdmin();
  if (!db) {
    console.error("[contact] Supabase env vars missing");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const { error } = await db.from("contacts").insert({ name, email, message });
  if (error) {
    console.error("[contact] insert failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  await notifyOwner("New contact message", {
    name,
    email,
    message: message.slice(0, 1000),
  });

  return NextResponse.json({ ok: true });
}
