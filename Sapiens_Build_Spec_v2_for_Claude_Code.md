# SAPIENS.CLUB — BUILD SPECIFICATION v2.0
**Audience: Claude Code. Purpose: build the complete Phase 1 website from this document alone.**
**Owner: Sapiens founder · July 2026 · Domain: sapiens.club · Host: Vercel**

---

## 0. PROJECT BRIEF (read first)

Sapiens is a pre-launch movement: a future app where real people help real people nearby — no money, no profiles to surf, no feeds. This website launches months before the app. Its jobs, in order: (1) make visitors *feel* the vision, (2) collect waitlist signups (email + phone + city), (3) recruit founding volunteers via a Google Form, (4) explain how the app will work and why it is safe. Tone: warm, calm, human — premium but quiet, energized by hand-drawn motion. Every word carries meaning; no corporate language (never: leverage, seamless, empower, unlock, revolutionize; never call people "users").

**Vocabulary (use exactly, never invent synonyms):**
- **Moneta** — the token earned for each completed help. Hard-earned, never bought, redeemable later.
- **Goodness Meter** — a calculated 0–100 score reflecting someone's helping life.
- **Celestial Journey** — the moon→sun growth visual. Milestones: crescent 10 · half moon 50 · full moon 100 · sunrise 500 · golden sun 1000 → light joins the shared galaxy.
- **Founding Sapiens** — the first 1000 volunteers.
- **City Saviours** — future paid helper roles (mention only as "later").

---

## 1. VARIABLES (single source of truth — also mirrored in CMS `siteSettings`)

| Variable | Value |
|---|---|
| `SITE_NAME` | Sapiens |
| `SITE_URL` | https://sapiens.club |
| `TAGLINE_VISION` | A society where helping each other is the default — not the exception. |
| `TAGLINE_HOOK` | The anti-social-network. Built for real life. |
| `LAUNCH_LINE` | Launching in India, 2026. |
| `CONTACT_EMAIL` | sapiensclub1@gmail.com *(will change to hello@sapiens.club via CMS later — must be CMS-editable, never hardcoded)* |
| `VOLUNTEER_FORM_URL` | ⚠️ **PLACEHOLDER — the URL provided was a /edit editor link which visitors cannot open. Owner must supply the public share link (Send → link icon → ends in /viewform). Until then use `#` and a "link coming" tooltip.** |
| `INSTAGRAM_URL` | https://www.instagram.com/sapiens.club_/ |
| `YOUTUBE_URL` | https://www.youtube.com/channel/UC3k3-4i8uhwbmzCQIZ3NBGA |
| `TWITTER_URL` | https://x.com/Sapiens_Clubb |
| `CITIES` | Pune, Mumbai, Bengaluru, Hyderabad, Delhi NCR, Chennai, Kolkata, Ahmedabad, Jaipur, Lucknow, Indore, Chandigarh, Other |
| `LOGO_SVG` | provided asset `file.svg` (footprint-S, vector paths, 1024×544 viewBox) — use as-is, refinement later |
| `LANGUAGE` | English only (structure code so i18n can be added later; no hardcoded strings outside CMS/content files) |

---

## 2. DESIGN SYSTEM

### 2.1 Color tokens (Tailwind theme)
```js
colors: {
  paper:  '#F7F4EC',   // day background — warm off-white
  ink:    '#141414',   // text, doodles, logo
  spark:  '#F59E2D',   // THE accent: CTAs, doodle highlights, Moneta, sun warmth
  night:  '#17142E',   // celestial section bg (deep indigo)
  nightdeep: '#0B0A18',// celestial vignette edges
  moonlight: '#CDD6FF',// stars, moon glow, night-section secondary text
  gold:   '#F0C078',   // sun stage, Goodness Meter fill, milestone dots
  clay:   '#D85A30',   // rare warm secondary (badges only)
}
```
Rules: spark on paper only for large text (≥24px) or filled buttons with ink text — never small body text (contrast). Night sections: text = moonlight/paper, accents = gold. The page background itself animates paper→night→dawn across the homepage scroll (see §8.6).

### 2.2 Typography
- **Display** (headlines, logo wordmark, doodle labels, marquee): `Cabin Sketch` (Google Fonts, weights 400/700). Never below 28px, never for paragraphs.
- **Body** (everything readable): `Nunito Sans` (Google Fonts, 400/600/700). Self-host both as WOFF2 via `next/font` with `display: swap`.
- Scale: H1 `clamp(2.5rem, 6vw, 4.5rem)` display · H2 `clamp(2rem,4vw,2.75rem)` display · H3 1.375rem body 700 · body 1.0625–1.125rem / 1.7 · caption 0.875rem.

### 2.3 Doodle asset system
~16 inline SVGs, hand-drawn line style (2.5px round-cap strokes, slightly wobbly paths, ink color; spark used as fill accents). Claude Code should draw these as SVG paths in the sketch aesthetic:
cloud ×3 variants · sun (rays) · sparkle ×2 · arrow (curved, hand-drawn) · paper plane · heart · umbrella-share vignette (2 figures) · tiffin-pass vignette (2 hands + steam) · high-five vignette (2 figures + spark burst) · two-people-back-to-back / two-people-facing (S2 swap pair) · door ×2 (A/B) · shield · pot/diya (footer flourish).
All doodles: `stroke-dasharray` line-draw animation on first viewport entry (600–900ms, staggered). Respect `prefers-reduced-motion` (render final state, no draw).

### 2.4 Buttons
- Primary: spark fill, ink text, sketch-style irregular border (SVG border or `border-radius: 255px 15px 225px 15px/15px 225px 15px 255px` hand-drawn trick), hover: slight rotate(-1deg) scale(1.03) + sparkle doodle pops.
- Secondary: transparent, 2px ink hand-drawn border, same hover behavior.
- Night sections: gold fill / moonlight outline variants.

---

## 3. LOGO & LOGO ANIMATION

- Header: footprint-S SVG at 40px height + wordmark "Sapiens" in Cabin Sketch 700. Hover: toes do a quick sequential bounce (like walking).
- **Hero intro animation (staged version, plays once per session, skippable on scroll/click, ~2.5s):**
  1. 0–0.8s: five small ink circles ("heads" of walking people) slide in from left along a gentle arc with 3 curved body strokes beneath, walking-stagger.
  2. 0.8–1.6s: heads drift up and settle into the five toe positions; body strokes flow together (opacity/position morph) into the S-sole path drawing itself via stroke-dasharray.
  3. 1.6–2.5s: fill sweeps into the paths (ink), tiny spark sparkle pops at top-right, gentle settle (scale 1.04→1).
  Meaning: people, together, moving forward, leaving a mark. Store `sessionStorage.sapiens_intro_seen` to skip on revisit.
- Loading state & 404: the footprint walks (steps appear/disappear in sequence).

---

## 4. TECH STACK & PROJECT STRUCTURE

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS · Framer Motion (entrances/hover) · GSAP + ScrollTrigger (celestial scrub, day→night bg, pinning) · Sanity v3 (content/admin at `/studio`) · Supabase (waitlist, contacts) · Resend (emails) · Vercel (hosting) · PostHog + Vercel Analytics.

**Dependencies:** `next react react-dom typescript tailwindcss framer-motion gsap @sanity/client @sanity/image-url sanity next-sanity @supabase/supabase-js resend zod posthog-js @upstash/ratelimit @upstash/redis`

```
/app
  layout.tsx (fonts, header, footer, analytics, bg-controller)
  page.tsx                  ← Home (S1–S9)
  why/page.tsx  what/page.tsx  how/page.tsx  club/page.tsx
  contact/page.tsx  shop/page.tsx  privacy/page.tsx  terms/page.tsx
  studio/[[...tool]]/page.tsx     ← Sanity Studio (admin panel)
  api/waitlist/route.ts  api/contact/route.ts  api/revalidate/route.ts
/components
  header.tsx footer.tsx logo-animated.tsx doodles/*.tsx buttons.tsx
  sections/s1-hero.tsx … s9 (one file per section)
  celestial/journey.tsx (pinned scrub) celestial/moon.tsx
  forms/waitlist-form.tsx forms/contact-form.tsx
  marquee.tsx city-select.tsx
/sanity  (schemas, client, queries)
/lib     (supabase.ts, resend.ts, ratelimit.ts, validators.ts)
/public  (fonts, og.png, favicon set)
```

**Environment variables (.env.local + Vercel):**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=   NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=           SANITY_REVALIDATE_SECRET=
NEXT_PUBLIC_SUPABASE_URL=        NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       RESEND_API_KEY=
UPSTASH_REDIS_REST_URL=          UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_POSTHOG_KEY=
```

---

## 5. HEADER & FOOTER

**Header:** sticky, paper bg with 90% opacity + blur when scrolled; logo left; nav right: WHAT · WHY · HOW · CLUB · CONTACT (Cabin Sketch 18px; active page gets a hand-drawn underline squiggle); small tote-bag doodle icon → /shop. On night sections header inverts (ink→paper text) via a `data-theme` observer. Mobile: hamburger (hand-drawn ≡) → full-screen paper overlay, the five nav words huge in Cabin Sketch, staggered slide-in, doodle cloud in corner.

**Footer (paper, dawn-tinted `#FBF3E4`):** Row 1: footprint-S + line "One small step for you. A giant leap for all of us." Row 2: nav links · Shop · For Organizations (→/club#organizations) · Contact. Row 3: social icons (hand-drawn style) → Instagram, YouTube, X (from CMS). Row 4: `CONTACT_EMAIL` (CMS-driven) · Privacy · Terms · "© 2026 Sapiens Club. Made with care, for a kinder world." A tiny diya/pot doodle sits in the corner, flame flickering (2-frame swap).

---

## 6. HOMEPAGE — SECTION SPECS WITH FINAL COPY

Background choreography: S1–S3 `paper` → S4 begins dusk gradient → S5 dusk → S6 full `night` → S7 dawn gradient → S8–S9 dawn paper `#FBF3E4`. Implemented as one GSAP timeline animating `<body>` background-color across scroll (see §8.6).

### S1 · HERO — "The Living Doodle World" (high energy, one-color restraint)
Layout: full viewport. Headline block center-left (60% width desktop, full mobile). Doodle world occupies edges/background.
Sequence on load: logo intro (§3) → headline words draw themselves in sketch strokes (per-word stroke-draw, 1.2s total) → sub fades up → CTAs pop with overshoot (scale 0.9→1.05→1) → doodle vignettes begin their loops.
**Copy:**
- H1: `A society where helping each other is the default — not the exception.` (the word "helping" gets a spark-orange hand-drawn circle scribbled around it, drawn after headline completes)
- Sub: `Sapiens is a community where real people help real people — offline, nearby, for nothing in return. Someone near you needs a hand right now. Someone near you is ready to give one.`
- CTA primary: `Join the movement` · CTA secondary: `Become a founding volunteer` (→ VOLUNTEER_FORM_URL, new tab)
- Micro-line: `Launching in India, 2026. No app needed yet — just belief.`
**Living world (the energy):**
- Three looping micro-vignettes placed around edges, staggered 4s loops: (a) umbrella shared — rain dots fall, second figure steps under, both bob happily; (b) tiffin passed hand-to-hand — steam curl rises, spark sparkle on handoff; (c) high-five — spark burst on contact.
- A paper-plane doodle flies across the full width every ~12s on a curved path, trailing a dashed line, carrying a tiny heart.
- 3 ink clouds drift at different speeds (60–120s loops). 
- Hand-drawn **marquee strip** at hero's bottom edge, slow continuous scroll, Cabin Sketch, separated by sparkle doodles: `helping is human ✦ trust is built one act at a time ✦ no money. no feeds. just neighbours ✦ the anti-social-network ✦` (marquee text CMS-editable).
- Desktop: two-layer parallax on doodles (mouse move, ±8px); doodles within 80px of cursor wiggle ±2°. Mobile: vignettes reduce to 2, parallax off.
- Scroll cue: hand-drawn arrow, gentle bob.
Acceptance: 60fps on mid-range Android; all motion `prefers-reduced-motion`-gated; total hero JS/SVG < 60KB.

### S2 · THE ACHE (quiet contrast — motion nearly stops)
Decision: **no statistic** — purely emotional; a number would make people analyze when they should feel.
- H2: `We have never been more connected. And never more alone.`
- Three lines, generous spacing, fade in one at a time on scroll:
  `Everything is one tap away — food, rides, entertainment. Everything except each other.`
  `We pass a hundred people a day and know none of them.`
  `And when money decides who gets help, kindness becomes a luxury.`
- Visual: two doodle figures back-to-back on phones; at section midpoint scroll, they swap to the facing-each-other pose (crossfade, 400ms). This turn IS the section's emotional beat.

### S3 · THE IDEA
- H2: `The anti-social-network. Built for real life.`
- Body: `No profiles to scroll. No feeds to get lost in. No money changing hands. You open Sapiens for one of two reasons:`
- Two door cards (hand-drawn doors, hover: door cracks open with spark light spilling out):
  Card A: `I need a hand` — `A ride. A meal. A skill. A teammate. Ask, and nearby Sapiens are quietly notified.`
  Card B: `I want to help` — `Tell us how you like to help. When someone nearby needs exactly that, you'll know.`
- Closing line (italic, centered): `When A helps B, they may never meet again. But someday, Z will help B. That is how a society learns to trust itself.`

### S4 · HOW IT WORKS
- H2: `Five steps. Zero rupees.`
- 5 cards, horizontal scroll-snap desktop / vertical stack mobile, each with doodle illustration + number in a spark circle:
  1. `Ask.` — `Raise a request — a ride, a meal, a game of badminton, a helping hand.`
  2. `Nearby Sapiens are pinged.` — `Only people who chose to help with exactly this. No broadcasting, no noise.`
  3. `Someone shows up.` — `Photo-verified, like your cab app. You always know who's coming.`
  4. `Help happens. Moneta is earned.` — `Our token of goodness. Earned, never bought. No money changes hands. Ever.`
  5. `You choose to connect.` — `If you both want to, a real friendship begins — founded on a real act.`
- Safety strip beneath (shield doodle + 5 one-liners, links to /how): `Government-ID verification before anyone helps or is helped · Photo check at every meetup · Ratings and a complaint system · A separate, group-only mode for under-18s · An SOS button connected to nearby Sapiens and local police.`
- Strip closing line: `Trust isn't a feature. It's the whole point.`

### S5 · REAL MOMENTS (dusk)
- H2: `Stories from the world we're building` · Sub: `The app isn't live yet. These are the moments it exists to create.` (honesty is non-negotiable — never present these as testimonials)
- 3 CMS-driven story cards (doodle spot illustrations, no photos):
  1. **The ride** — `The cab cancelled twice. His appointment was in twenty minutes. He pressed Help — and a neighbour he'd never met, already heading that way, said "come along." They talked the whole ride.`
  2. **Friday night dinner** — `Jessica, 45, lives alone in Mumbai. That Friday the pain was too much to cook through. She pressed Help. Three homes nearby had extra food from a party. Her neighbour from the park — the one she'd only ever said hello to — walked it over, warm.`
  3. **The parking lot** — `Late night, Anna noticed two men following her. She pressed SOS. Every Sapiens within reach was alerted, and so were the police. Strangers arrived in minutes. She never learned their names — Sapiens doesn't work that way. She didn't need to.`
- Phase 2 note in code comments: this section swaps to real stories + interview video embeds; schema already supports `videoUrl`.

### S6 · THE CELESTIAL JOURNEY (night — the signature; full spec §8)
Intro line before pin (moonlight text on night): `On Sapiens, you don't collect followers. You collect light.`
After the pinned scrub, three explainer cards (night-styled):
- **Moneta** — `One for every completed help. Earned, never bought. One day you'll spend it on good things — but its real value is what it says about you.`
- **Goodness Meter** — `A gentle 0-to-100 reflection of your helping life — how often, how varied, how kind.`
- **Milestones** — `At 1, 3, 10, 50, 100, 500 and 1000 helps, the people you've connected with celebrate with you.`

### S7 · THE MOVEMENT (dawn begins)
- H2: `This is bigger than an app.`
- Body: `Every month, each city will name its most generous Sapiens. The best of them become City Saviours — people whose full-time work is helping, supported by the community. When two Sapiens both give five stars, they can capture the moment together — the deed is the story, not the selfie. Milestones ripple out to everyone you've helped. Goodness, made visible.`
- Organizations ribbon (bordered, hand-drawn corners): `A campus? A company? A housing society? Bring Sapiens to your community first.` → button `For organizations` → /club#organizations.

### S8 · JOIN (dawn paper)
- H2: `Be one of the first.`
Two tiers side-by-side (stack mobile):
**Tier 1 — Join the movement** (inline form): email (required) · phone (optional) · city (curated dropdown from `CITIES`, "Other" reveals free-text) · consent checkbox `I'd like Sapiens to contact me about the launch.` (required) · button `Count me in`. Under: `No spam. One meaningful email a month, and the day we launch in your city.`
Success state: form morphs into the footprint-S drawing itself + `Welcome, Sapiens. We'll see you at the beginning.` (+ confetti of tiny doodle sparks). Fire PostHog `waitlist_signup {city, source}`.
**Tier 2 — Become a Founding Sapiens** :
`The first thousand. The ones who believed before there was an app to believe in.`
Founding Sapiens receive: `a numbered founding membership (Founding Sapiens #001–#1000) · a permanent founding badge on your future profile · beta access before anyone else · your name on the Founding Wall when we launch · first consideration for City Saviour roles.` 
Button: `Apply to be a Founding Sapiens` → VOLUNTEER_FORM_URL (new tab). Micro-line: `Applications are read by humans. Every single one.`

### S9 · CLOSING + FOOTER
Full-width dawn moment: sunrise doodle over the horizon, H2: `The sun rises one act of kindness at a time.` Single centered CTA `Join the movement` (scrolls to S8 / opens modal). Then footer (§5).

---

## 7. INNER PAGES — COPY & SPECS

### /why — the manifesto
Long-form essay layout (65ch measure), pull-quotes in Cabin Sketch, doodle margin art. Structure: **The strange sadness of the best times** (Insight 01: comfort everywhere, misery anyway; humans are social creatures who need trusted environments; trust between strangers has thinned, warmth declined) → **When money became the measure** (Insight 02: money overtook human values; the universal fuel shouldn't be the only key to a good life; those improving society should be supported beyond money) → **Our answer** (help without profiles, status or payment; A helps B, Z helps B — trust compounds) → **Vision:** `A society where human values, trust and care for each other are prevalent — not just in words, but in action.` → **Mission:** `To empower one billion people in five years with the tools, motivation and environment to practice their true nature: helping others.` → CTA to /club.

### /what — the anti-social-network
Hero: TAGLINE_HOOK huge. Then a two-column "We don't / We do" set (hand-drawn ✗ and ✓):
✗ `No ads — your attention isn't for sale.` ✗ `No feeds — nothing to doomscroll.` ✗ `No follower counts — worth isn't a number.` ✗ `No strangers' highlight reels.` ✗ `No money — help can't be bought here.`
✓ `Real requests from real neighbours.` ✓ `Real meetings, offline, nearby.` ✓ `Real safety — everyone verified.` ✓ `Real friendship — chosen after a real act.` ✓ `Real worth — measured in light, not likes.`
Then **One app, many kindnesses**: `Sometimes helping looks like a ride. Sometimes a meal, a lesson, a game, a donated bookshelf, an SOS answered at midnight. Sapiens holds them all — food, knowledge, time, things, travel, safety.` (six small doodle chips: Food · Knowledge · Time · Things · Travel · Safety). Close with the connection philosophy paragraph + CTA.

### /how — how it works + safety & trust
Part 1: S4's five steps, expanded a paragraph each. Part 2 — **Safety, in full** (plain-spoken H3 blocks):
- `Who can join` — email + phone with OTP to look around; **government-ID KYC (Aadhaar or Driving Licence) before anyone can give or receive help.** `Verification isn't a hurdle. It's the foundation.`
- `Photo verification` — like your cab app: you see who's coming, they see who asked.
- `Under 18` — child mode: group-only connections, no one-to-one meetings with unknown adults.
- `Ratings, feedback & complaints` — both sides rate after every help (text or voice); a complaint system with human review.
- `SOS` — one press alerts nearby Sapiens and the local police station with your location. `Built for the moment we hope never comes.`
- `Your data` — `We don't sell it. We don't show you ads. We collect the minimum and guard it like it's ours — because it's yours.`
End: FAQ teaser + CTA.

### /club
Hero: `The first thousand.` Both tiers full-width (same components as S8). Then `#organizations` block: H2 `Bring Sapiens to your community first` · body: `Movements need soil. A university campus, a company, a housing society, an NGO — communities where trust already has roots are where Sapiens will bloom first. If you lead one, let's talk.` · bullets: early city access · a launch partner badge · co-designed onboarding for your community · CTA `Write to us` → mailto CONTACT_EMAIL (CMS). Then **What founding members get** (the §S8 Tier-2 list, expanded).

### /contact
Form: name · email · message → /api/contact. Direct email shown (CMS). Social links. Then **FAQ** (accordion, CMS-driven, JSON-LD FAQPage). Ten Q&As, final copy:
1. `Is Sapiens free?` → `Completely. No fees, no ads, no paid features. Helping shouldn't have a price tag.`
2. `When does it launch?` → `We're launching city by city across India in 2026. Join the waitlist and you'll know the day your city opens.`
3. `Which cities first?` → `That depends partly on you — we're watching where the waitlist grows fastest. Tell us your city when you sign up.`
4. `How is Sapiens safe?` → `Everyone verifies with a government ID before giving or receiving help, photos confirm who you're meeting, both sides rate every help, and an SOS button connects you to nearby Sapiens and local police.`
5. `What is Moneta?` → `Our token of goodness. You earn one for every completed help. It can't be bought — only earned — and will be redeemable for good things after launch.`
6. `What is the Goodness Meter?` → `A 0-to-100 reflection of your helping life — how often you help, in how many ways, and how kindly.`
7. `Can children use Sapiens?` → `Under-18s get a separate child mode with group-only connections — no one-to-one meetings with unknown adults.`
8. `How does Sapiens make money?` → `We don't sell ads or data — ever. A community shop (merchandise whose proceeds flow back into the community) comes later. Sustaining the mission matters; profiting from your attention doesn't.`
9. `Can my company or campus join?` → `Yes — communities are where we launch first. Visit the Club page and write to us.`
10. `Is Sapiens an NGO?` → `Sapiens is a mission-first platform. Whatever the legal wrapper, the rule is fixed: the community's interest comes first, always.`

### /shop — the tease
Paper page, three doodle products (tee, mug, tote) each rubber-stamped `NOT FOR SALE — YET` (stamp rotates in on scroll). H2: `First we build the community. Then we wear it.` Body: `The Sapiens Shop opens after launch. Every rupee it makes flows straight back into the community — always.` Email input `Tell me when it opens` → /api/waitlist with `source: 'shop'`.

### /privacy & /terms
Claude Code: generate clear, plain-English pages appropriate for an India-based pre-launch site collecting email/phone/city with consent (India DPDP Act-aware): what's collected, why, storage (Supabase), no selling of data, no ads, contact for deletion (CONTACT_EMAIL), cookies limited to analytics (PostHog), governing law India. Mark both with a visible "Last updated" date and a code comment: OWNER SHOULD HAVE THESE PROFESSIONALLY REVIEWED BEFORE SCALE.

---

## 8. THE CELESTIAL JOURNEY — BUILD SPEC (scroll-driven)

1. Wrapper ~350vh (mobile ~260vh); inner stage pinned full-viewport via GSAP ScrollTrigger `{ pin: true, scrub: 0.8 }`.
2. Scroll progress 0→1 maps to helps 0→1000 through a piecewise curve giving early milestones room: progress 0–0.45 → helps 0–100 · 0.45–0.75 → 100–500 · 0.75–0.92 → 500–1000 · 0.92–1.0 → galaxy finale.
3. Moon rendering (port from approved prototype): disc with radial gradient; shadow layer `translateX(-{min(helps,100)}%)` for phases; after 100 helps lerp disc colors `#F4EFE1/#CFC7B2 → #FFF0C2/#E8983A`; glow color lerps `#CDD6FF → #FFB24D`, scale 1→1.18; conic rays fade in above ~450 helps, slow rotation; horizon warm glow rises with progress; at helps ≥940 crossfade to galaxy layer (spiral haze + ~46 gold stars) — the personal sun dissolves INTO it.
4. Captions swap at thresholds (CMS `journeyStage`): New moon `Your journey begins` · Crescent — 10 helps `Your light is growing` · Half moon — 50 `Halfway to full` · Full moon — 100 `You light the way for others` · Sunrise — 500 `Your warmth starts to spread` · Golden sun — 1000 `Your light joins the galaxy.` Final overlay line: `Individually we glow. Together, we are a galaxy.`
5. HUD (side rail desktop / bottom strip mobile): Helps counter (= mapped value, rounded), Moneta (= helps), Goodness Meter bar+number `Math.round(100*(1-Math.exp(-h/280)))`. Milestone dots ignite with a gold pulse as thresholds pass.
6. **Day→night choreography:** a separate ScrollTrigger animates the page background paper→night across S5's span (so night *arrives* before the pin), and night→dawn `#FBF3E4` across S7.
7. `prefers-reduced-motion`: replace pin/scrub with a static 6-panel storyboard grid (stage image + caption each). 
8. Performance: transform/opacity only (no animated filters/box-shadows on scroll); stars as one absolutely-positioned layer; will-change discipline; GSAP dynamically imported when S5 enters viewport. Must hold 60fps on mid-range Android — this section is the make-or-break of "premium."

---

## 9. SANITY (ADMIN PANEL) — SCHEMAS

Studio mounted at `/studio` (Sanity handles login; invite owner's email). Everything editable → publish → live within seconds via revalidate webhook. Schemas:

```ts
// siteSettings (singleton): taglines, launchLine, contactEmail, volunteerFormUrl,
//   instagramUrl, youtubeUrl, twitterUrl, marqueeItems: string[], cities: string[],
//   announcement?: string (optional site-wide banner)
// homeSection: key (s1..s9), heading, subheading, body (portableText), extraFields (per-section labels/CTA text)
// story: title, body (text), city, doodleKey (enum of doodle illustrations), videoUrl?, isReal (boolean, default false), order
// faqItem: question, answer, order
// milestone: helps (number), label, caption, order   // yes — even the ladder numbers are editable
// journeyStage: threshold, name, caption, order
// page: slug (why|what|how|club-extras), title, content (portableText with pullQuote + doodle blocks)
// shopTeaseItem: name, doodleKey, stampText
```
Revalidation: Sanity webhook → `/api/revalidate` (secret-checked) → `revalidateTag('content')`. All fetches tagged `content`, `revalidate: 3600` as fallback.

---

## 10. SUPABASE — SQL (run in SQL editor)

```sql
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  phone text,
  city text,
  source text not null default 'hero' check (source in ('hero','club','shop','closing')),
  consent boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, message text not null,
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
alter table public.contacts enable row level security;
create policy "waitlist_insert_only" on public.waitlist for insert to anon with check (true);
create policy "contacts_insert_only" on public.contacts for insert to anon with check (true);
-- no select policies for anon: reads happen server-side with service role only
```

---

## 11. API ROUTES

**/api/waitlist (POST):** zod-validate `{email, phone?, city?, source, consent:true, website:''}` (`website` = honeypot; non-empty → return 200 silently, do nothing). Rate-limit 5/min/IP (Upstash; if env absent, skip gracefully). Upsert on email conflict → **always return generic success** (never reveal existing subscription). On new insert: Resend confirmation to subscriber + notify CONTACT_EMAIL. Errors: 422 validation, 429 rate, 500 generic; client shows friendly copy (`Something wobbled. Try once more?`).
**/api/contact (POST):** same pattern; insert + Resend notification to owner.
**/api/revalidate (POST):** verify `SANITY_REVALIDATE_SECRET`, `revalidateTag('content')`.

**Email templates (Resend, simple HTML matching brand — paper bg, ink text, spark button):**
- Waitlist confirmation — subject `Welcome, Sapiens 🌱` body: `You're in. You just joined the people building a society where helping each other is the default — not the exception. We'll write about once a month, and the moment Sapiens opens in your city, you'll be the first to know. Until then: someone near you could probably use a hand today. You don't need an app for that. — Team Sapiens` + social links.
- Owner notifications — plain digest of the submission fields.

---

## 12. SEO, AI-FRIENDLINESS & ANALYTICS

- Server-rendered semantic HTML; one h1/page; Metadata API per page (titles like `Sapiens — the anti-social-network` / `Why Sapiens exists`).
- OG image (1200×630): paper bg, footprint-S, vision line in Cabin Sketch, spark accents — generate as static asset.
- JSON-LD: `Organization` (name Sapiens, url, logo, sameAs: the three socials) on layout; `FAQPage` on /contact; `WebSite` on home.
- `/llms.txt`: 15-line plain-text summary (what Sapiens is, vocabulary definitions, launch info, contact) for AI crawlers.
- sitemap.xml + robots.txt via Next built-ins; canonical URLs; alt text on every SVG (`role="img"` + title).
- PostHog events: `waitlist_signup{city,source}` · `volunteer_click` · `journey_completed` (user scrolled through S6) · `scroll_depth{25,50,75,100}` · `shop_tease_view`. Vercel Analytics on.

---

## 13. ACCESSIBILITY & PERFORMANCE BARS (acceptance criteria)

WCAG AA contrast everywhere (spark never used for small text on paper) · full keyboard nav + visible focus (spark 2px outline) · skip-to-content link · every animation behind `prefers-reduced-motion` · forms with proper labels/aria/error announcements · Lighthouse ≥95 across the board · LCP <2.0s on 4G · CLS <0.05 · first-load JS <200KB gz (GSAP lazy-loaded) · fonts subset + swap · all doodles inline SVG · works without JS for content + forms degrade to standard POST where feasible.

---

## 14. BUILD ORDER FOR CLAUDE CODE

1. Scaffold Next.js 15 + TS + Tailwind; theme tokens (§2.1); fonts via next/font; deploy pipeline check.
2. Layout: header, footer, mobile menu, button components, doodle SVG library (§2.3), animated logo component (§3).
3. Static homepage S1–S9 with all §6 copy hardcoded first (content before motion); inner pages §7; shop tease; privacy/terms generated.
4. Sanity: studio at /studio, schemas §9, seed all copy into CMS, switch pages to CMS fetch, revalidate webhook.
5. Supabase tables §10; API routes + emails §11; wire forms (waitlist inline + modal reuse, contact); success states.
6. Motion pass: hero living world (§6-S1), section entrances, doodle line-draws, S2 figure-swap, door hovers, marquee.
7. The Celestial Journey pinned scrub + day→night choreography (§8). Budget the most time here.
8. SEO/JSON-LD/llms.txt/OG (§12); analytics events; reduced-motion audit; performance pass to §13 bars.
9. QA: mobile-first review at 360px/768px/1440px; cross-browser (Chrome/Safari/Firefox + iOS Safari); forms end-to-end; empty-CMS fallbacks.

## 15. HUMAN-ONLY TASKS (owner, not Claude Code)

☐ Replace VOLUNTEER_FORM_URL with the **public /viewform link** (Google Form → Send → link icon) — current /edit link will show visitors a permission error.
☐ Create accounts + paste env keys: Sanity project, Supabase project, Resend (verify domain for from@sapiens.club later), Upstash (optional), PostHog.
☐ Point sapiens.club DNS to Vercel (recommended: via Cloudflare, and set up hello@sapiens.club forwarding when Workspace/forwarding is ready — then just edit contactEmail in /studio).
☐ Invite owner email to Sanity studio (this is the admin login).
☐ Confirm final CITIES list order (Pune first is fine — it's home).
☐ Soft-launch to ~20 trusted people before public share.

---

*End of Build Specification v2.0. This document + the logo SVG asset are sufficient inputs. Where any detail is unspecified, default to: warm, calm, human — premium but quiet, hand-drawn, one orange.*
