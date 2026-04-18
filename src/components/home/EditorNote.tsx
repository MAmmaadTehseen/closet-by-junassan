import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Reveal from "@/components/ui/Reveal";

export default function EditorNote() {
  return (
    <section className="bg-cream/60">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Reveal>
          <p className="eyebrow mb-5">— Editor&apos;s Note</p>
        </Reveal>
        <ScrollReveal
          as="blockquote"
          className="font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl"
          text="“Good style shouldn’t cost the earth. We hunt down the labels you love, inspect every stitch, and hand them on at a price Pakistan can actually afford.”"
        />
        <Reveal>
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
