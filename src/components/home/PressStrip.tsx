import { Quote } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const MENTIONS = [
  {
    publication: "Dawn Weekender",
    quote: "Pakistan's thrift scene just got its first truly curated closet.",
  },
  {
    publication: "Mashion",
    quote: "The edit is tighter than a boutique and half the price.",
  },
  {
    publication: "Something Haute",
    quote: "Sunday drops feel like a front-row seat at a sample sale.",
  },
  {
    publication: "Hip In Pakistan",
    quote: "An honest, Instagram-native thrift experience we badly needed.",
  },
];

export default function PressStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <Reveal>
        <p className="eyebrow mb-8">As seen in</p>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MENTIONS.map((m, i) => (
          <Reveal key={m.publication} delay={i * 90}>
            <figure className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-paper p-5 hover-lift">
              <Quote className="h-5 w-5 text-ink/40" />
              <blockquote className="font-display text-base leading-snug text-ink">
                &ldquo;{m.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {m.publication}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
