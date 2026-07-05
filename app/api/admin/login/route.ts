import { NextRequest, NextResponse } from "next/server";
import {
  passwordMatches,
  tokenForCurrentPassword,
  ADMIN_COOKIE,
} from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/ratelimit";

/*
 * POST /api/admin/login — checks the password, sets the admin cookie.
 * Rate-limited per IP to blunt brute-force attempts (5/min via Upstash if
 * configured). Generic 401 on failure — no hint whether the password or
 * the config was wrong.
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await checkRateLimit(`admin-login:${ip}`))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let password = "";
  try {
    ({ password } = await req.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!passwordMatches(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = tokenForCurrentPassword();
  if (!token) return NextResponse.json({ ok: false }, { status: 500 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
