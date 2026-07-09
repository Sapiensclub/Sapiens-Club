/*
 * Seeds the blog (Blog Build Spec §7.1): the 5 categories, one placeholder
 * author (RENAME IN STUDIO — I don't know the founder's name), and one
 * test post whose body exercises the custom block toolkit so the Stage-3
 * renderers have real content to render.
 *
 * createOrReplace with fixed _ids → safe to re-run (it resets these docs).
 *
 *   node scripts/seed-blog.mjs
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-06-01",
  token: env.SANITY_API_WRITE_TOKEN || env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

/* portable-text helpers (every array item needs a stable _key) */
let k = 0;
const key = () => `bk${(k++).toString(36)}`;
const span = (text, marks = []) => ({ _type: "span", _key: key(), text, marks });
const block = (style, text, opts = {}) => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: opts.markDefs ?? [],
  children: opts.children ?? [span(text)],
  ...(opts.list ? { listItem: opts.list, level: 1 } : {}),
});
const p = (t) => block("normal", t);
const h2 = (t) => block("h2", t);
const h3 = (t) => block("h3", t);
const bullet = (t) => block("normal", t, { list: "bullet" });

/* a paragraph containing one link */
function pWithLink(before, linkText, href, after) {
  const id = key();
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [{ _key: id, _type: "link", href }],
    children: [span(before), span(linkText, [id]), span(after)],
  };
}

const CATEGORIES = [
  { slug: "real-help-stories", title: "Real Help Stories", description: "First-hand accounts of neighbours helping neighbours — the moments Sapiens exists to multiply." },
  { slug: "safety", title: "Safety", description: "How trust is engineered: verification, photo checks, SOS, and everything that keeps real-world helping safe." },
  { slug: "community-building", title: "Community Building", description: "Practical ways to grow trust where you live — campuses, housing societies, neighbourhoods." },
  { slug: "science-of-kindness", title: "The Science of Kindness", description: "What research actually says about helping, happiness and human connection — with sources." },
  { slug: "city-guides", title: "City Guides", description: "City-by-city looks at community life in India, and where Sapiens is heading next." },
];

const docs = [
  ...CATEGORIES.map((c) => ({
    _id: `category.${c.slug}`,
    _type: "category",
    title: c.title,
    slug: { _type: "slug", current: c.slug },
    description: c.description,
  })),

  {
    _id: "author.founder",
    _type: "author",
    name: "The Sapiens Founder", // ← RENAME in Studio → Author
    slug: { _type: "slug", current: "founder" },
    role: "Founder, Sapiens",
    bio: "Building Sapiens — a society where helping each other is the default, not the exception. Writing about real help, safety and community as we go.",
    credentials: "Founder of Sapiens, launching across India in 2026",
    social: [
      { _key: key(), _type: "object", platform: "Instagram", url: "https://www.instagram.com/sapiens.club_/" },
      { _key: key(), _type: "object", platform: "X", url: "https://x.com/Sapiens_Clubb" },
      { _key: key(), _type: "object", platform: "YouTube", url: "https://www.youtube.com/channel/UC3k3-4i8uhwbmzCQIZ3NBGA" },
      { _key: key(), _type: "object", platform: "Website", url: "https://sapiens.club" },
    ],
  },

  {
    _id: "blogPost.test",
    _type: "blogPost",
    title: "Why helping a stranger feels so good — and what that means for your city",
    slug: { _type: "slug", current: "why-helping-a-stranger-feels-so-good" },
    author: { _type: "reference", _ref: "author.founder" },
    category: { _type: "reference", _ref: "category.science-of-kindness" },
    tags: ["kindness", "helping", "community", "science"],
    excerpt:
      "The warm feeling after helping someone isn't a coincidence — it's one of the most consistent findings in happiness research. Here's what the science says, and why we're building a whole app around it.",
    publishedAt: "2026-07-01T09:00:00Z",
    featured: true,
    body: [
      p("You've felt it. You help a stranger carry a bag up the stairs, give directions, share an umbrella — and for the next hour something in you is lighter. Psychologists call it the “helper's high,” and it's one of the most reliable effects in the study of human happiness."),
      {
        _type: "keyTakeaways",
        _key: key(),
        title: "Key takeaways",
        items: [
          "Helping others measurably increases the helper's own happiness — often more than spending on yourself.",
          "The effect is strongest when helping is voluntary, personal, and visible in its impact.",
          "Cities feel kinder not when people change, but when helping becomes easy and normal.",
        ],
      },
      h2("The evidence, briefly"),
      pWithLink(
        "In a famous series of experiments, people given money to spend on others reported greater happiness than those told to spend it on themselves — across incomes and across cultures. Prosocial behaviour keeps showing up as one of the few things that reliably moves wellbeing. (We collect more of this research in ",
        "The Science of Kindness",
        "/blog/category/science-of-kindness",
        " as we publish.)"
      ),
      {
        _type: "pullQuote",
        _key: key(),
        text: "Kindness isn't a personality trait some cities have and others lack. It's an infrastructure problem.",
        attribution: "from the Sapiens manifesto",
      },
      h2("Why doesn't it happen more often, then?"),
      p("If helping feels this good, why do we walk past each other all day? Three honest reasons:"),
      bullet("We don't know who needs help — needs are invisible until someone asks."),
      bullet("We don't know if it's safe — a stranger is a question mark in both directions."),
      bullet("We don't know if it's wanted — offering can feel like intruding."),
      pWithLink(
        "Every one of those is a solvable design problem. That's the entire idea behind ",
        "how Sapiens works",
        "/how",
        ": make the need visible, make both people verified, and make the ask explicit — then get out of the way."
      ),
      {
        _type: "callout",
        _key: key(),
        tone: "tip",
        title: "Try it this week",
        body: "One deliberate act of help for someone you don't know — carry, guide, share, teach. Notice what the next hour feels like. That feeling is the product we're building.",
      },
      { _type: "divider", _key: key(), style: "footsteps" },
      h3("Frequently asked"),
      {
        _type: "faq",
        _key: key(),
        items: [
          {
            _key: key(),
            _type: "object",
            question: "Does helping really make the helper happier, or is that a myth?",
            answer: "It's one of the most replicated findings in wellbeing research: voluntary, personal acts of help reliably increase the helper's own reported happiness — often more than equivalent self-directed spending.",
          },
          {
            _key: key(),
            _type: "object",
            question: "What is Sapiens?",
            answer: "Sapiens is a community platform launching in India in 2026 where verified neighbours help each other — no money, no feeds, no followers. Real people helping real people, nearby.",
          },
        ],
      },
      p("We'll keep publishing what we learn — the research, the safety engineering, and the real stories — as we build. If any of this resonates, the waitlist below is where the movement starts."),
    ],
  },
];

console.log(`Seeding ${docs.length} blog documents…`);
let tx = client.transaction();
for (const doc of docs) tx = tx.createOrReplace(doc);
try {
  await tx.commit();
  console.log("✔ Blog seeded: 5 categories, 1 author (rename in Studio!), 1 test post.");
} catch (err) {
  console.error("✖ Seed failed:", err.message);
  process.exit(1);
}
