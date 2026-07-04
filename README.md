# Sapiens.club

Pre-launch website for **Sapiens** — the anti-social-network. Real people
helping real people nearby: no money, no profiles, no feeds. Launching in
India, 2026.

## Stack

Next.js 15 (App Router, TypeScript) · Tailwind CSS v4 · Sanity (CMS at
`/studio`) · Supabase (waitlist + contacts) · Resend (email) · Vercel.

The full build specification lives in
`Sapiens_Build_Spec_v2_for_Claude_Code.md`.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build check
```

Secrets live in `.env.local` (gitignored — never commit it). The list of
required variables is in the spec, §4.
