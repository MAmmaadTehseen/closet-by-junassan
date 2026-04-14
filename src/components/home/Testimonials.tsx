import { Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const QUOTES = [
  {
    name: "Hira, Lahore",
    quote: "Got a Levi's jacket for the price of a fast-fashion one. Condition was exactly as described.",
    rating: 5,
  },
  {
    name: "Daniyal, Karachi",
    quote: "COD made it so easy. Called me, delivered in 3 days, and the shoes were brand new.",
    rating: 5,
  },
  {
    name: "Sana, Islamabad",
    quote: "Their drops feel like treasure hunts. I check every Sunday. Never disappointed.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="eyebrow mb-2">Loved in Pakistan</p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            2,000+ happy closets and counting.
          </h2>
        </div>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-3">
        {QUOTES.map((q, i) => (
          <Reveal key={q.name} delay={i * 100}>
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-paper p-7">
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: q.rating }).map((_, k) => (
                  <Star key={k} className="h-3.5 w-3.5 fill-ink text-ink" />
                ))}
              </div>
              <blockquote className="font-display text-lg leading-snug text-ink">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-auto pt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                — {q.name}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
