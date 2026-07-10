-- Blog CTA: allow 'blog' as a waitlist signup source.
-- Run once in Supabase → SQL Editor → New query → paste → Run. Idempotent.
--
-- Why: the waitlist table has a CHECK constraint listing the allowed
-- sources. The blog's end-of-post CTA reports source='blog' so you can see
-- which signups the blog earned. Until this runs, the API falls back to
-- 'closing' so no signup is ever lost (see app/api/waitlist/route.ts).

alter table public.waitlist drop constraint if exists waitlist_source_check;

alter table public.waitlist
  add constraint waitlist_source_check
  check (source in ('hero','club','shop','closing','blog'));
