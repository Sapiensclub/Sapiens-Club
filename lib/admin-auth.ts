import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/*
 * Minimal single-owner admin auth (no user accounts needed).
 *
 * The owner sets ADMIN_PASSWORD in the environment. On login we compare it
 * (timing-safe) and, on success, set an httpOnly cookie whose value is an
 * HMAC of the password. Because the token is derived from the password,
 * changing ADMIN_PASSWORD instantly logs everyone out — and the raw
 * password is never stored in the cookie.
 *
 * Everything here is server-only (node:crypto). Never import from a client
 * component.
 */
const COOKIE = "sapiens_admin";

function expectedToken(password: string): string {
  // salt with the revalidate secret if present, so the token isn't just a
  // plain hash of the password
  const secret = process.env.SANITY_REVALIDATE_SECRET ?? "sapiens";
  return createHmac("sha256", secret).update(password).digest("hex");
}

/** timing-safe string compare */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** true if the submitted password matches ADMIN_PASSWORD */
export function passwordMatches(submitted: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false; // not configured → nobody gets in
  return safeEqual(submitted, real);
}

export function tokenForCurrentPassword(): string | null {
  const real = process.env.ADMIN_PASSWORD;
  return real ? expectedToken(real) : null;
}

export const ADMIN_COOKIE = COOKIE;

/** read the cookie and verify it against the current password */
export async function isAdminAuthed(): Promise<boolean> {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, expectedToken(real));
}
