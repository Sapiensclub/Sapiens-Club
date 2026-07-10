import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import { LogoMark } from "@/components/logo";
import { Doodle } from "@/components/doodles/doodle";
import { SparkleB, CloudC } from "@/components/doodles/basics";

/*
 * BLOG PORTABLE TEXT RENDERERS (Blog Build Spec §3, §7.3).
 * One renderer per custom block, styled with the site's brand tokens
 * (paper/ink/spark/dawn/clay, Cabin Sketch headings, Nunito Sans body).
 * Server-rendered — no client JS needed for any of these (the FAQ uses
 * native <details>, so it works without JavaScript).
 *
 * Self-contained under components/blog/** per spec §8.
 */

/* ---------- shared helpers ---------- */

type ImgValue = {
  url?: string;
  alt?: string;
  caption?: string;
  w?: number;
  h?: number;
  lqip?: string;
};

/** Stable heading id, shared with the Table of Contents (stage 5). */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

/** Flatten a portable-text block's spans into plain text. */
export function blockText(value: unknown): string {
  const children = (value as { children?: { text?: string }[] })?.children;
  return (children ?? []).map((c) => c.text ?? "").join("");
}

export type Heading = { id: string; text: string; level: 2 | 3 };

/**
 * Headings for the Table of Contents — read from the same body blocks the
 * renderers use, with the same ids, so the TOC links can never drift.
 */
export function extractHeadings(body: unknown): Heading[] {
  if (!Array.isArray(body)) return [];
  const out: Heading[] = [];
  for (const b of body) {
    const blk = b as { _type?: string; style?: string };
    if (blk?._type !== "block") continue;
    if (blk.style !== "h2" && blk.style !== "h3") continue;
    const text = blockText(b);
    if (!text) continue;
    out.push({ id: headingId(text), text, level: blk.style === "h2" ? 2 : 3 });
  }
  return out;
}

/** In-article FAQ items — feeds FAQPage structured data in stage 6. */
export function extractFaqs(body: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(body)) return [];
  return body.flatMap((b) => {
    const blk = b as { _type?: string; items?: { question: string; answer: string }[] };
    return blk?._type === "faq" ? (blk.items ?? []) : [];
  });
}

function CaptionedImage({ value, priority = false }: { value: ImgValue; priority?: boolean }) {
  if (!value?.url || !value.w || !value.h) return null;
  return (
    <figure className="my-10">
      <Image
        src={value.url}
        alt={value.alt ?? ""}
        width={value.w}
        height={value.h}
        sizes="(max-width: 768px) 100vw, 720px"
        priority={priority}
        placeholder={value.lqip ? "blur" : undefined}
        blurDataURL={value.lqip}
        className="h-auto w-full rounded-lg"
      />
      {value.caption && (
        <figcaption className="mt-2 text-center text-sm opacity-70">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ---------- video embed ---------- */

/** YouTube id from watch / youtu.be / shorts / embed URLs. */
function youTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? m[1] : null;
}

function VideoEmbed({ value }: { value: { url?: string; caption?: string } }) {
  const url = value?.url;
  if (!url) return null;
  const yt = youTubeId(url);

  return (
    <figure className="my-10">
      {yt ? (
        /* privacy-friendly nocookie host, lazy-loaded */
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${yt}`}
            title={value.caption ?? "Video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      ) : /\.(mp4|webm)$/i.test(url) ? (
        <video controls preload="none" className="w-full rounded-lg">
          <source src={url} />
        </video>
      ) : (
        /* unknown provider — never embed a random origin; link out instead */
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="sketch-border block border-2 border-ink/60 px-6 py-4 font-bold hover:text-clay"
        >
          Watch the video ↗
        </a>
      )}
      {value.caption && (
        <figcaption className="mt-2 text-center text-sm opacity-70">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ---------- callout ---------- */

const CALLOUT_TONE: Record<string, { ring: string; label: string }> = {
  info: { ring: "border-ink/50", label: "Note" },
  tip: { ring: "border-spark", label: "Tip" },
  warning: { ring: "border-clay", label: "Heads up" },
};

function Callout({
  value,
}: {
  value: { tone?: string; title?: string; body?: string };
}) {
  const tone = CALLOUT_TONE[value?.tone ?? "info"] ?? CALLOUT_TONE.info;
  return (
    <aside
      className={`sketch-border my-10 border-2 ${tone.ring} bg-dawn px-6 py-5`}
    >
      <p className="font-display text-lg font-bold">
        {value.title || tone.label}
      </p>
      <p className="mt-2 leading-relaxed">{value.body}</p>
    </aside>
  );
}

/* ---------- key takeaways ---------- */

function KeyTakeaways({
  value,
}: {
  value: { title?: string; items?: string[] };
}) {
  if (!value?.items?.length) return null;
  return (
    <aside className="sketch-border my-10 border-2 border-ink/60 bg-dawn px-7 py-6">
      {/* a <p>, not a heading: keeps the document outline identical to the
          Table of Contents, which is built from real h2/h3 body blocks */}
      <div className="flex items-center gap-2">
        <SparkleB className="h-5 w-5 shrink-0 text-spark" />
        <p className="font-display text-2xl font-bold">
          {value.title || "Key takeaways"}
        </p>
      </div>
      <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
        {value.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

/* ---------- in-article FAQ (also feeds FAQPage schema in stage 6) ---------- */

function Faq({
  value,
}: {
  value: { items?: { question: string; answer: string }[] };
}) {
  if (!value?.items?.length) return null;
  return (
    <div className="my-10 space-y-3">
      {value.items.map(({ question, answer }) => (
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
  );
}

/* ---------- gallery ---------- */

function Gallery({ value }: { value: { images?: ImgValue[] } }) {
  const images = (value?.images ?? []).filter((i) => i?.url);
  if (!images.length) return null;
  return (
    <div className="my-10 grid gap-4 sm:grid-cols-2">
      {images.map((img, i) => (
        <figure key={img.url ?? i}>
          {img.url && img.w && img.h && (
            <Image
              src={img.url}
              alt={img.alt ?? ""}
              width={img.w}
              height={img.h}
              sizes="(max-width: 640px) 100vw, 360px"
              placeholder={img.lqip ? "blur" : undefined}
              blurDataURL={img.lqip}
              className="h-full w-full rounded-lg object-cover"
            />
          )}
          {img.caption && (
            <figcaption className="mt-1.5 text-center text-xs opacity-70">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/* ---------- doodle divider ---------- */

function Footsteps() {
  return (
    <span className="flex items-end gap-3 text-ink/40">
      <LogoMark className="h-6 w-auto -rotate-12" />
      <LogoMark className="h-6 w-auto translate-y-1 rotate-6" />
      <LogoMark className="h-6 w-auto -rotate-6" />
    </span>
  );
}

function Divider({ value }: { value: { style?: string } }) {
  const style = value?.style ?? "sparkle";
  return (
    <div className="my-14 flex justify-center" role="separator">
      {style === "footsteps" ? (
        <Footsteps />
      ) : style === "cloud" ? (
        <Doodle className="block w-16 text-ink/50">
          <CloudC />
        </Doodle>
      ) : (
        <span className="flex items-center gap-4 text-spark">
          <SparkleB className="h-4 w-4" />
          <SparkleB className="h-6 w-6" />
          <SparkleB className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}

/* ---------- heading with anchor id (feeds the TOC) ---------- */

function Heading({
  level,
  children,
  value,
}: {
  level: 2 | 3 | 4;
  children: React.ReactNode;
  value: unknown;
}) {
  const id = headingId(blockText(value));
  const cls = {
    2: "mt-14 !text-3xl scroll-mt-24",
    3: "mt-10 text-2xl font-bold scroll-mt-24",
    4: "mt-8 text-xl font-bold scroll-mt-24",
  }[level];
  const Tag = `h${level}` as "h2" | "h3" | "h4";
  return (
    <Tag id={id} className={cls}>
      {children}
    </Tag>
  );
}

/* ---------- the components map ---------- */

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 leading-relaxed">{children}</p>,
    h2: ({ children, value }) => (
      <Heading level={2} value={value}>
        {children}
      </Heading>
    ),
    h3: ({ children, value }) => (
      <Heading level={3} value={value}>
        {children}
      </Heading>
    ),
    h4: ({ children, value }) => (
      <Heading level={4} value={value}>
        {children}
      </Heading>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-spark pl-6 text-lg italic leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2 pl-6 leading-relaxed">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-6 leading-relaxed">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const internal = href.startsWith("/") || href.startsWith("#");
      const cls =
        "font-bold underline decoration-spark decoration-2 underline-offset-4 hover:text-clay";
      /* internal links stay client-side <Link> (spec §5 internal linking) */
      return internal ? (
        <Link href={href} className={cls}>
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {children}
        </a>
      );
    },
  },
  types: {
    bodyImage: ({ value }) => <CaptionedImage value={value} />,
    gallery: ({ value }) => <Gallery value={value} />,
    videoEmbed: ({ value }) => <VideoEmbed value={value} />,
    pullQuote: ({ value }) => (
      <figure className="my-12">
        <blockquote className="font-display border-l-4 border-spark pl-6 text-2xl font-bold leading-snug md:text-3xl">
          {value?.text}
        </blockquote>
        {value?.attribution && (
          <figcaption className="mt-3 pl-6 text-sm opacity-70">
            — {value.attribution}
          </figcaption>
        )}
      </figure>
    ),
    callout: ({ value }) => <Callout value={value} />,
    keyTakeaways: ({ value }) => <KeyTakeaways value={value} />,
    faq: ({ value }) => <Faq value={value} />,
    divider: ({ value }) => <Divider value={value} />,
  },
};

/** Renders a blog post body. */
export function BlogBody({ value }: { value: unknown }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <PortableText value={value as any} components={components} />
  );
}
