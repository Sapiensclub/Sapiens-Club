import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { getFaqs, getSiteSettings, getPageIntro, type Faq } from "@/sanity/content";

export const metadata: Metadata = {
  title: "Contact Sapiens",
  description:
    "Write to the Sapiens team — a real human reads every message. Plus answers to the ten questions everyone asks.",
};

/*
 * /contact (spec §7): form, direct email, socials, and the 10-question
 * FAQ as a native accordion (details/summary — accessible without JS).
 * Stage 4 moves the FAQ into the CMS; stage 8 adds FAQPage JSON-LD.
 */
const FALLBACK_FAQ: Faq[] = [
  {
    question: "Is Sapiens free?",
    answer: "Completely. No fees, no ads, no paid features. Helping shouldn't have a price tag.",
  },
  {
    question: "When does it launch?",
    answer: "We're launching city by city across India in 2026. Join the waitlist and you'll know the day your city opens.",
  },
  {
    question: "Which cities first?",
    answer: "That depends partly on you — we're watching where the waitlist grows fastest. Tell us your city when you sign up.",
  },
  {
    question: "How is Sapiens safe?",
    answer: "Everyone verifies with a government ID before giving or receiving help, photos confirm who you're meeting, both sides rate every help, and an SOS button connects you to nearby Sapiens and local police.",
  },
  {
    question: "What is Moneta?",
    answer: "Our token of goodness. You earn one for every completed help. It can't be bought — only earned — and will be redeemable for good things after launch.",
  },
  {
    question: "What is the Goodness Meter?",
    answer: "A 0-to-100 reflection of your helping life — how often you help, in how many ways, and how kindly.",
  },
  {
    question: "Can children use Sapiens?",
    answer: "Under-18s get a separate child mode with group-only connections — no one-to-one meetings with unknown adults.",
  },
  {
    question: "How does Sapiens make money?",
    answer: "We don't sell ads or data — ever. A community shop (merchandise whose proceeds flow back into the community) comes later. Sustaining the mission matters; profiting from your attention doesn't.",
  },
  {
    question: "Can my company or campus join?",
    answer: "Yes — communities are where we launch first. Visit the Club page and write to us.",
  },
  {
    question: "Is Sapiens an NGO?",
    answer: "Sapiens is a mission-first platform. Whatever the legal wrapper, the rule is fixed: the community's interest comes first, always.",
  },
];

export default async function ContactPage() {
  const [site, faqs, intro] = await Promise.all([
    getSiteSettings(),
    getFaqs(FALLBACK_FAQ),
    getPageIntro("contact"),
  ]);
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-center">{intro?.heading || "Say hello"}</h1>
      {intro?.intro && (
        <p className="mx-auto mt-4 max-w-xl text-center text-lg leading-relaxed">
          {intro.intro}
        </p>
      )}

      <div className="mt-16 grid items-start gap-12 md:grid-cols-2">
        <ContactForm />
        <div className="space-y-6 text-lg">
          <p>
            Prefer email? Write to{" "}
            <a
              href={`mailto:${site.contactEmail}`}
              className="font-bold underline decoration-spark decoration-2 underline-offset-4"
            >
              {site.contactEmail}
            </a>
            . A real human reads every message.
          </p>
          <p className="text-base">
            We&apos;re also on{" "}
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline decoration-spark decoration-2 underline-offset-4"
            >
              Instagram
            </a>
            ,{" "}
            <a
              href={site.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline decoration-spark decoration-2 underline-offset-4"
            >
              YouTube
            </a>{" "}
            and{" "}
            <a
              href={site.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline decoration-spark decoration-2 underline-offset-4"
            >
              X
            </a>
            .
          </p>
        </div>
      </div>

      {/* FAQPage JSON-LD (spec §12) — mirrors the visible accordion */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          }),
        }}
      />

      <section className="mt-24">
        <h2>The ten questions everyone asks</h2>
        <div className="mt-8 space-y-3">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="sketch-border group border-2 border-ink/60 px-6 py-4"
            >
              <summary className="cursor-pointer list-none font-bold marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="mr-2 inline-block text-spark transition-transform group-open:rotate-90">
                  ➤
                </span>
                {question}
              </summary>
              <p className="mt-3 leading-relaxed">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
