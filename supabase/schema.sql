-- Sapiens database schema (spec §10).
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Safe to re-run: everything is IF NOT EXISTS / OR REPLACE where possible.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  phone text,
  city text,
  source text not null default 'hero' check (source in ('hero','club','shop','closing')),
  consent boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- RLS on, with NO anon policies at all.
-- Every write goes through our API routes using the service-role key, which
-- bypasses RLS. So the public (anon) key must have zero access: it can't
-- read (steal signups), delete, or insert (spam/inject) directly. This
-- closes the direct-insert hole an earlier insert-only policy left open.
alter table public.waitlist enable row level security;
alter table public.contacts enable row level security;

-- Remove the old permissive insert policies if they exist.
drop policy if exists "waitlist_insert_only" on public.waitlist;
drop policy if exists "contacts_insert_only" on public.contacts;
