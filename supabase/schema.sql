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

alter table public.waitlist enable row level security;
alter table public.contacts enable row level security;

-- inserts only for the anon key; reads happen server-side with the
-- service role key only (never expose signups publicly)
drop policy if exists "waitlist_insert_only" on public.waitlist;
create policy "waitlist_insert_only" on public.waitlist
  for insert to anon with check (true);

drop policy if exists "contacts_insert_only" on public.contacts;
create policy "contacts_insert_only" on public.contacts
  for insert to anon with check (true);
