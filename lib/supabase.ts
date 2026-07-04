import { createClient } from "@supabase/supabase-js";

/*
 * Server-only Supabase client using the secret (service role) key —
 * bypasses row-level security, so it must never be imported by client
 * components. Used by the API routes to insert waitlist/contact rows.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // envs missing — callers degrade gracefully
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
