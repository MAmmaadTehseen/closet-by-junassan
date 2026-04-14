import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function EditorNote() {
  return (
    <section className="bg-cream/60">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Reveal>
          <p className="eyebrow mb-5">— Editor&apos;s Note</p>
          <blockquote className="font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
            <span className="text-ink/25">&ldquo;</span>
            Good style shouldn&apos;t cost the earth. We hunt down the labels you love,
            <span className="italic text-ink/80"> inspect every stitch</span>, and hand
            them on at a price Pakistan can actually afford.
            <span className="text-ink/25">&rdquo;</span>
          </blockquote>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Junassan — Founder
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block rounded-full border border-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-ink hover:text-paper"
          >
            Our Story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
