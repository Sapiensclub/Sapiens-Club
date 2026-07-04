import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/*
 * Rate limiting (spec §11): 5 requests/min/IP via Upstash. If the Upstash
 * env vars aren't set (they're optional), limiting is skipped gracefully —
 * the honeypot and validation still stand guard.
 */
let limiter: Ratelimit | null | undefined;

function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  limiter =
    url && token
      ? new Ratelimit({
          redis: new Redis({ url, token }),
          limiter: Ratelimit.slidingWindow(5, "1 m"),
          prefix: "sapiens",
        })
      : null;
  return limiter;
}

/** true = allowed, false = over the limit */
export async function checkRateLimit(ip: string): Promise<boolean> {
  const rl = getLimiter();
  if (!rl) return true;
  try {
    const { success } = await rl.limit(ip);
    return success;
  } catch {
    return true; // Upstash down — never block real people because of it
  }
}
