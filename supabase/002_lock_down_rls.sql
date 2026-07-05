-- SECURITY FIX (July 2026): remove the public insert policies.
-- Run once in Supabase → SQL Editor. Idempotent.
--
-- Why: the anon (publishable) key ships in every browser. The original
-- "insert only" policy let anyone POST rows straight to the tables, skipping
-- our honeypot, rate limiting and validation — a spam/pollution/injection
-- hole. All legitimate writes go through /api/* using the service-role key,
-- which ignores RLS, so no public policy is needed.

drop policy if exists "waitlist_insert_only" on public.waitlist;
drop policy if exists "contacts_insert_only" on public.contacts;

-- ensure RLS stays enabled (default-deny for anon once policies are gone)
alter table public.waitlist enable row level security;
alter table public.contacts enable row level security;
