/*
 * Seeds the Sanity dataset with the spec copy (spec §14 stage 4).
 * Safe to re-run: documents use fixed _ids and are created-or-replaced,
 * so it never duplicates. Run AFTER editing in the studio only if you
 * want to reset to the original copy.
 *
 *   node scripts/seed-sanity.mjs
 *
 * Needs a token with write access: set SANITY_API_WRITE_TOKEN in
 * .env.local (sanity.io/manage → API → Tokens → add "Editor" token),
 * or make sure SANITY_API_READ_TOKEN has Editor permissions.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

/* minimal .env.local parser — no dependency needed */
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

const docs = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    taglineVision:
      "A society where helping each other is the default — not the exception.",
    taglineHook: "The anti-social-network. Built for real life.",
    launchLine: "Launching in India, 2026.",
    contactEmail: "sapiensclub1@gmail.com",
    volunteerFormUrl: "https://forms.gle/nK73qW328F6WkQjPA",
    instagramUrl: "https://www.instagram.com/sapiens.club_/",
    youtubeUrl: "https://www.youtube.com/channel/UC3k3-4i8uhwbmzCQIZ3NBGA",
    twitterUrl: "https://x.com/Sapiens_Clubb",
    marqueeItems: [
      "helping is human",
      "trust is built one act at a time",
      "no money. no feeds. just neighbours",
      "the anti-social-network",
    ],
    cities: [
      "Pune", "Mumbai", "Bengaluru", "Hyderabad", "Delhi NCR", "Chennai",
      "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Indore", "Chandigarh", "Other",
    ],
  },

  {
    _id: "campaignBanner",
    _type: "campaignBanner",
    enabled: false,
    mode: "bar",
    headline: "Founding Sapiens applications are open — 1000 places, read by humans.",
    ctaLabel: "Apply now",
    ctaUrl: "https://forms.gle/nK73qW328F6WkQjPA",
    theme: "spark",
    dismissible: true,
  },

  /* home section headings (fallbacks match these exactly) */
  { _id: "homeSection.s2", _type: "homeSection", key: "s2", heading: "We have never been more connected. And never more alone." },
  { _id: "homeSection.s3", _type: "homeSection", key: "s3", heading: "The anti-social-network. Built for real life." },
  { _id: "homeSection.s4", _type: "homeSection", key: "s4", heading: "Five steps. Zero rupees." },
  { _id: "homeSection.s5", _type: "homeSection", key: "s5", heading: "Stories from the world we're building", subheading: "The app isn't live yet. These are the moments it exists to create." },
  { _id: "homeSection.s6", _type: "homeSection", key: "s6", heading: "On Sapiens, you don't collect followers. You collect light." },
  { _id: "homeSection.s7", _type: "homeSection", key: "s7", heading: "This is bigger than an app." },
  { _id: "homeSection.s8", _type: "homeSection", key: "s8", heading: "Be one of the first." },
  { _id: "homeSection.s9", _type: "homeSection", key: "s9", heading: "The sun rises one act of kindness at a time." },

  /* stories (S5) */
  {
    _id: "story.ride", _type: "story", title: "The ride", doodleKey: "ride", isReal: false, order: 1,
    body: "The cab cancelled twice. His appointment was in twenty minutes. He pressed Help — and a neighbour he'd never met, already heading that way, said “come along.” They talked the whole ride.",
  },
  {
    _id: "story.dinner", _type: "story", title: "Friday night dinner", doodleKey: "tiffin", isReal: false, order: 2, city: "Mumbai",
    body: "Jessica, 45, lives alone in Mumbai. That Friday the pain was too much to cook through. She pressed Help. Three homes nearby had extra food from a party. Her neighbour from the park — the one she'd only ever said hello to — walked it over, warm.",
  },
  {
    _id: "story.parking", _type: "story", title: "The parking lot", doodleKey: "shield", isReal: false, order: 3,
    body: "Late night, Anna noticed two men following her. She pressed SOS. Every Sapiens within reach was alerted, and so were the police. Strangers arrived in minutes. She never learned their names — Sapiens doesn't work that way. She didn't need to.",
  },

  /* journey stages (S6 / stage-7 scrub captions) */
  { _id: "journeyStage.0", _type: "journeyStage", threshold: 0, name: "New moon", caption: "Your journey begins", order: 0 },
  { _id: "journeyStage.10", _type: "journeyStage", threshold: 10, name: "Crescent", caption: "Your light is growing", order: 1 },
  { _id: "journeyStage.50", _type: "journeyStage", threshold: 50, name: "Half moon", caption: "Halfway to full", order: 2 },
  { _id: "journeyStage.100", _type: "journeyStage", threshold: 100, name: "Full moon", caption: "You light the way for others", order: 3 },
  { _id: "journeyStage.500", _type: "journeyStage", threshold: 500, name: "Sunrise", caption: "Your warmth starts to spread", order: 4 },
  { _id: "journeyStage.1000", _type: "journeyStage", threshold: 1000, name: "Golden sun", caption: "Your light joins the galaxy.", order: 5 },

  /* milestones (celebration thresholds) */
  { _id: "milestone.1", _type: "milestone", helps: 1, label: "First light", caption: "Your first help — the hardest and the most important.", order: 0 },
  { _id: "milestone.3", _type: "milestone", helps: 3, label: "Kindling", caption: "Three helps. It's becoming a habit.", order: 1 },
  { _id: "milestone.10", _type: "milestone", helps: 10, label: "Crescent", caption: "Your light is growing.", order: 2 },
  { _id: "milestone.50", _type: "milestone", helps: 50, label: "Half moon", caption: "Halfway to full.", order: 3 },
  { _id: "milestone.100", _type: "milestone", helps: 100, label: "Full moon", caption: "You light the way for others.", order: 4 },
  { _id: "milestone.500", _type: "milestone", helps: 500, label: "Sunrise", caption: "Your warmth starts to spread.", order: 5 },
  { _id: "milestone.1000", _type: "milestone", helps: 1000, label: "Golden sun", caption: "Your light joins the galaxy.", order: 6 },

  /* FAQ (/contact) */
  { _id: "faq.1", _type: "faqItem", order: 1, question: "Is Sapiens free?", answer: "Completely. No fees, no ads, no paid features. Helping shouldn't have a price tag." },
  { _id: "faq.2", _type: "faqItem", order: 2, question: "When does it launch?", answer: "We're launching city by city across India in 2026. Join the waitlist and you'll know the day your city opens." },
  { _id: "faq.3", _type: "faqItem", order: 3, question: "Which cities first?", answer: "That depends partly on you — we're watching where the waitlist grows fastest. Tell us your city when you sign up." },
  { _id: "faq.4", _type: "faqItem", order: 4, question: "How is Sapiens safe?", answer: "Everyone verifies with a government ID before giving or receiving help, photos confirm who you're meeting, both sides rate every help, and an SOS button connects you to nearby Sapiens and local police." },
  { _id: "faq.5", _type: "faqItem", order: 5, question: "What is Moneta?", answer: "Our token of goodness. You earn one for every completed help. It can't be bought — only earned — and will be redeemable for good things after launch." },
  { _id: "faq.6", _type: "faqItem", order: 6, question: "What is the Goodness Meter?", answer: "A 0-to-100 reflection of your helping life — how often you help, in how many ways, and how kindly." },
  { _id: "faq.7", _type: "faqItem", order: 7, question: "Can children use Sapiens?", answer: "Under-18s get a separate child mode with group-only connections — no one-to-one meetings with unknown adults." },
  { _id: "faq.8", _type: "faqItem", order: 8, question: "How does Sapiens make money?", answer: "We don't sell ads or data — ever. A community shop (merchandise whose proceeds flow back into the community) comes later. Sustaining the mission matters; profiting from your attention doesn't." },
  { _id: "faq.9", _type: "faqItem", order: 9, question: "Can my company or campus join?", answer: "Yes — communities are where we launch first. Visit the Club page and write to us." },
  { _id: "faq.10", _type: "faqItem", order: 10, question: "Is Sapiens an NGO?", answer: "Sapiens is a mission-first platform. Whatever the legal wrapper, the rule is fixed: the community's interest comes first, always." },

  /* shop tease */
  { _id: "shopTeaseItem.tee", _type: "shopTeaseItem", name: "The Sapiens tee", doodleKey: "tee", stampText: "Not for sale — yet", order: 1 },
  { _id: "shopTeaseItem.mug", _type: "shopTeaseItem", name: "The morning mug", doodleKey: "mug", stampText: "Not for sale — yet", order: 2 },
  { _id: "shopTeaseItem.tote", _type: "shopTeaseItem", name: "The everyday tote", doodleKey: "tote", stampText: "Not for sale — yet", order: 3 },
];

console.log(`Seeding ${docs.length} documents into project ${client.config().projectId} / ${client.config().dataset}…`);
let tx = client.transaction();
for (const doc of docs) tx = tx.createOrReplace(doc);
try {
  await tx.commit();
  console.log("✔ Seed complete. Open /studio to see the content.");
} catch (err) {
  console.error("✖ Seed failed:", err.message);
  if (String(err.message).includes("Insufficient permissions")) {
    console.error(
      "\nYour token can read but not write. Create a write token:\n" +
        "  1. sanity.io/manage → project 'sqbrcyhy' → API → Tokens → Add API token\n" +
        "  2. Name: 'seed', Permissions: Editor\n" +
        "  3. Add to .env.local as SANITY_API_WRITE_TOKEN=<token>\n" +
        "  4. Re-run: node scripts/seed-sanity.mjs"
    );
  }
  process.exit(1);
}
