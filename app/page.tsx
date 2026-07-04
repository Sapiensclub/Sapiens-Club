import Image from "next/image";

/*
 * Temporary placeholder home page — replaced by the full S1–S9 homepage in
 * build-order stage 3. Exists so sapiens.club can go live on Vercel early.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Image
        src="/logo.svg"
        alt="Sapiens footprint logo"
        width={220}
        height={117}
        priority
      />
      <h1 className="max-w-3xl">
        A society where <span className="text-spark">helping</span> each other
        is the default — not the exception.
      </h1>
      <p className="max-w-xl text-lg leading-relaxed">
        Sapiens is a community where real people help real people — offline,
        nearby, for nothing in return.
      </p>
      <p className="text-sm font-semibold tracking-wide">
        Launching in India, 2026. No app needed yet — just belief.
      </p>
    </main>
  );
}
