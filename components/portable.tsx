import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import { Doodle } from "@/components/doodles/doodle";
import {
  CloudB,
  SunDoodle,
  HeartDoodle,
  ShieldDoodle,
  SparkleA,
  PaperPlane,
} from "@/components/doodles/basics";

/*
 * Renders CMS rich text (Portable Text) with the Sapiens look — sketch
 * headings, spark-underlined links, bordered pull-quotes, and doodles.
 * Used by the prose pages (why, privacy, terms). Server-safe.
 */
const DOODLES: Record<string, React.ComponentType<{ className?: string }>> = {
  cloud: CloudB,
  sun: SunDoodle,
  heart: HeartDoodle,
  shield: ShieldDoodle,
  sparkle: SparkleA,
  plane: PaperPlane,
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-4 leading-relaxed">{children}</p>,
    h2: ({ children }) => <h2 className="mt-14 !text-3xl">{children}</h2>,
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-bold">{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold underline decoration-spark decoration-2 underline-offset-4"
      >
        {children}
      </a>
    ),
  },
  types: {
    pullQuote: ({ value }) => (
      <blockquote className="font-display my-10 border-l-4 border-spark pl-6 text-2xl font-bold leading-snug md:text-3xl">
        {value?.text}
      </blockquote>
    ),
    doodle: ({ value }) => {
      const D = DOODLES[value?.doodleKey as string];
      if (!D) return null;
      return (
        <Doodle className="my-8 block w-16 text-ink">
          <D />
        </Doodle>
      );
    },
  },
};

export function Prose({ value }: { value: unknown }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <PortableText value={value as any} components={components} />
  );
}
