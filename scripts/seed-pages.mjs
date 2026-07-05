/*
 * Seeds the inner-page CMS documents with the current site copy so the
 * owner sees real content to edit in the studio (Level-2 CMS, July 2026).
 * createOrReplace by fixed id → safe to re-run. Needs a write token.
 *
 *   node scripts/seed-pages.mjs
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

/* --- Portable Text builders (each block needs a stable _key) --- */
let k = 0;
const key = () => `k${(k++).toString(36)}`;
const span = (text, marks = []) => ({ _type: "span", _key: key(), text, marks });
/* build a block; supports **bold** and *italic* inline via a tiny parser */
function block(style, text) {
  const children = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) children.push(span(text.slice(last, m.index)));
    const t = m[0];
    if (t.startsWith("**")) children.push(span(t.slice(2, -2), ["strong"]));
    else children.push(span(t.slice(1, -1), ["em"]));
    last = m.index + t.length;
  }
  if (last < text.length) children.push(span(text.slice(last)));
  if (!children.length) children.push(span(text));
  return { _type: "block", _key: key(), style, markDefs: [], children };
}
const p = (t) => block("normal", t);
const h2 = (t) => block("h2", t);
const pq = (text) => ({ _type: "pullQuote", _key: key(), text });
const dd = (doodleKey) => ({ _type: "doodle", _key: key(), doodleKey });

const whyContent = [
  h2("The strange sadness of the best times"),
  p("By almost every measure, this is the most comfortable moment in human history. Food arrives at the door. Rides appear at the kerb. Any fact, any film, any person's highlight reel — one tap away. And yet, ask around honestly and you'll hear the same quiet confession: something is missing."),
  p("We are social creatures. Not as a slogan — as biology. We need environments we can trust: streets where a stranger's face is a comfort rather than a warning, neighbourhoods where asking for help is normal and offering it is unremarkable. That environment has been thinning for a generation. Trust between strangers has worn down. Warmth has become something we consume on screens instead of something we practise on footpaths."),
  pq("Comfort everywhere. Company nowhere. That is the strange sadness of the best times."),
  h2("When money became the measure"),
  p("Somewhere along the way, money stopped being just a tool and became the measure of nearly everything — including care. Help became a service. Kindness got a price tag. If you can pay, the whole city works for you; if you can't, the city walks past."),
  p("Money is the universal fuel, and it should keep being one. But it cannot be the *only* key to a good life. A society where the people who quietly improve it — the ones who show up, teach, carry, cook, listen — are supported and celebrated beyond what their bank balance says: that is not a utopia. It is a design choice. Nobody made it yet."),
  dd("heart"),
  h2("Our answer"),
  p("Sapiens is help without profiles, without status, without payment. You ask; someone nearby shows up. You offer; someone nearby is relieved. No feed to perform on. No follower count to grow. No bill at the end."),
  p("When A helps B, they may never meet again — and that's fine, because someday Z will help B, and B will help someone else's A. Help doesn't travel in straight lines. It compounds, the way trust always has: one act at a time, until a whole city believes in itself again."),
  pq("Vision: A society where human values, trust and care for each other are prevalent — not just in words, but in action."),
  pq("Mission: To empower one billion people in five years with the tools, motivation and environment to practice their true nature: helping others."),
  p("If any of this feels like yours, it is. Come build it."),
];

const privacyContent = [
  p("The short version: we collect the minimum, we never sell it, and we show no ads. The long version is below — written to be read, not skimmed past."),
  h2("What we collect, and why"),
  p("**Waitlist:** your email (required), phone (optional) and city (optional) — so we can tell you when Sapiens launches, especially in your city. You give this with an explicit consent checkbox; unticked, nothing is stored."),
  p("**Contact form:** your name, email and message — so a human can reply to you."),
  p("**Analytics:** anonymous usage events (pages viewed, buttons clicked), used only to make the site better. No advertising cookies, no cross-site tracking, no profiles built about you."),
  h2("Where it lives"),
  p("Waitlist and contact submissions are stored in Supabase, our database provider, protected by row-level security so they are not publicly readable. Emails we send go through Resend. The site is hosted on Vercel."),
  h2("What we will never do"),
  p("Sell, rent or trade your data. To anyone. For anything. Show you ads or let advertisers near your information. Email you more than genuinely necessary — about one email a month."),
  h2("Your rights"),
  p("Under India's Digital Personal Data Protection Act, you can ask what we hold about you, ask us to correct it, or ask us to delete it entirely. One email to sapiensclub1@gmail.com does any of the three — no forms, no friction. Unsubscribing from emails is one click in any email we send."),
  h2("Cookies"),
  p("Only what analytics needs to count you once instead of twice. No advertising or third-party marketing cookies."),
  h2("Governing law"),
  p("This policy is governed by the laws of India. If we ever change it meaningfully, the date at the top changes and — if you're on the waitlist — we'll tell you."),
];

const termsContent = [
  p("These terms cover this website — the pre-launch home of Sapiens. When the app launches, it will have its own terms; nothing here signs you up for anything beyond this site."),
  h2("What this site is"),
  p("Sapiens.club describes a product that is being built and collects voluntary signups from people who want to hear about it. Joining the waitlist creates no account, costs nothing, and promises nothing except that we'll write to you — about once a month, and on launch day in your city."),
  h2("What we ask of you"),
  p("Submit only your own, accurate information. Don't attempt to disrupt the site, scrape other people's data, or abuse the forms."),
  h2("What's ours"),
  p("The Sapiens name, the footprint logo, the doodles and the words on this site belong to Sapiens Club. Please don't reuse them commercially without asking — we're friendly, just write to sapiensclub1@gmail.com."),
  h2("Honest limitations"),
  p("Everything here describes an app that does not exist yet. Features, dates and cities may change as we build. The site is provided as-is; we work hard to keep it accurate and available, but we can't promise perfection, and we aren't liable for losses arising from relying on a pre-launch description."),
  h2("Governing law"),
  p("These terms are governed by the laws of India. Questions, concerns, disagreements — email first: sapiensclub1@gmail.com. Humans read it."),
];

const docs = [
  { _id: "prosePage.why", _type: "prosePage", slug: "why", title: "Why Sapiens exists", content: whyContent },
  { _id: "prosePage.privacy", _type: "prosePage", slug: "privacy", title: "Privacy", content: privacyContent },
  { _id: "prosePage.terms", _type: "prosePage", slug: "terms", title: "Terms", content: termsContent },

  {
    _id: "pageWhat", _type: "pageWhat",
    heading: "The anti-social-network. Built for real life.",
    weDont: [
      "No ads — your attention isn't for sale.",
      "No feeds — nothing to doomscroll.",
      "No follower counts — worth isn't a number.",
      "No strangers' highlight reels.",
      "No money — help can't be bought here.",
    ],
    weDo: [
      "Real requests from real neighbours.",
      "Real meetings, offline, nearby.",
      "Real safety — everyone verified.",
      "Real friendship — chosen after a real act.",
      "Real worth — measured in light, not likes.",
    ],
    kindnessHeading: "One app, many kindnesses",
    kindnessIntro: "Sometimes helping looks like a ride. Sometimes a meal, a lesson, a game, a donated bookshelf, an SOS answered at midnight. Sapiens holds them all — food, knowledge, time, things, travel, safety.",
    kindnessChips: ["Food", "Knowledge", "Time", "Things", "Travel", "Safety"],
    closing: "And when a help ends, nothing is owed. If you both felt it — the conversation that didn't want to stop, the laugh on the doorstep — you choose to stay connected. Friendship on Sapiens isn't requested. It's earned, once, in person, for real.",
  },

  {
    _id: "pageHow", _type: "pageHow",
    heading: "Five steps. Zero rupees.",
    steps: [
      { _key: key(), title: "Ask.", doodleKey: "plane", body: "Raise a request — a ride, a meal, a game of badminton, a helping hand. It takes under a minute: what you need, roughly when, roughly where. No justifying, no bargaining, no price. Asking for help is the bravest button in the app, and we've made it the simplest." },
      { _key: key(), title: "Nearby Sapiens are pinged.", doodleKey: "sparkle", body: "Your request doesn't get broadcast to a feed — Sapiens has no feed. It quietly reaches only the people nearby who already said they like helping with exactly this kind of thing. If you offered rides, you hear about rides. No noise for anyone else, no performance for anyone at all." },
      { _key: key(), title: "Someone shows up.", doodleKey: "facing", body: "Before anyone arrives, you see who's coming — photo-verified, like your cab app, in both directions. They see who asked, you see who answered. Two real names, two real faces, one small plan. Most helps are done and dusted within the hour." },
      { _key: key(), title: "Help happens. Moneta is earned.", doodleKey: "highfive", body: "The ride happens, the meal lands warm, the shelf gets carried up three floors. The helper earns one Moneta — our token of goodness. It's earned, never bought, and no money changes hands between people. Ever. Later, Moneta will be redeemable for good things; its real value is what it says about you." },
      { _key: key(), title: "You choose to connect.", doodleKey: "heart", body: "When the help ends, nothing is owed and nothing is automatic. If you both want to stay in touch, you both say so — and a real friendship begins, founded on a real act instead of a follow button. If not, you part as two people who made one day slightly better." },
    ],
    safetyHeading: "Safety, in full",
    safety: [
      { _key: key(), title: "Who can join", body: "An email and phone number with OTP lets you look around. But before anyone can give or receive help, they complete government-ID KYC — Aadhaar or Driving Licence. Verification isn't a hurdle. It's the foundation." },
      { _key: key(), title: "Photo verification", body: "Like your cab app: you see who's coming, they see who asked. Every meetup starts with two faces both sides have already seen." },
      { _key: key(), title: "Under 18", body: "Under-18s get a separate child mode with group-only connections — no one-to-one meetings with unknown adults, full stop." },
      { _key: key(), title: "Ratings, feedback & complaints", body: "Both sides rate after every help — text or voice, whichever is easier. A complaint system with human review sits behind it, and patterns are acted on, not archived." },
      { _key: key(), title: "SOS", body: "One press alerts nearby Sapiens and the local police station with your location. Built for the moment we hope never comes." },
      { _key: key(), title: "Your data", body: "We don't sell it. We don't show you ads. We collect the minimum and guard it like it's ours — because it's yours." },
    ],
    safetyLine: "Trust isn't a feature. It's the whole point.",
  },

  {
    _id: "pageClub", _type: "pageClub",
    heading: "The first thousand.",
    tagline: "The ones who believed before there was an app to believe in.",
    waitlistHeading: "Join the movement",
    waitlistIntro: "The waitlist is how Sapiens decides where to launch first. Tell us your city, and you'll know the day it opens there.",
    foundingHeading: "Become a Founding Sapiens",
    foundingIntro: "One thousand places. Applications read by humans — every single one.",
    perks: [
      { _key: key(), title: "A numbered founding membership", body: "Founding Sapiens #001–#1000. Your number is yours forever — nobody else will ever hold it." },
      { _key: key(), title: "A permanent founding badge", body: "On your future profile, visible to everyone you ever help. It says: I was here before there was an app to believe in." },
      { _key: key(), title: "Beta access before anyone else", body: "You'll use Sapiens — and shape it — months before your city does." },
      { _key: key(), title: "Your name on the Founding Wall", body: "When we launch, the first thousand names go up together. The wall stays up for good." },
      { _key: key(), title: "First consideration for City Saviour roles", body: "When paid helper roles arrive later, Founding Sapiens are the first people we call." },
    ],
    orgHeading: "Bring Sapiens to your community first",
    orgBody: "Movements need soil. A university campus, a company, a housing society, an NGO — communities where trust already has roots are where Sapiens will bloom first. If you lead one, let's talk.",
    orgPoints: ["Early city access", "A launch partner badge", "Co-designed onboarding for your community"],
  },

  { _id: "pageIntro.contact", _type: "pageIntro", slug: "contact", heading: "Say hello", intro: "" },
  { _id: "pageIntro.shop", _type: "pageIntro", slug: "shop", heading: "First we build the community. Then we wear it.", intro: "The Sapiens Shop opens after launch. Every rupee it makes flows straight back into the community — always." },
];

console.log(`Seeding ${docs.length} page documents…`);
let tx = client.transaction();
for (const doc of docs) tx = tx.createOrReplace(doc);
try {
  await tx.commit();
  console.log("✔ Pages seeded. Open /studio → Pages to edit them.");
} catch (err) {
  console.error("✖ Seed failed:", err.message);
  process.exit(1);
}
