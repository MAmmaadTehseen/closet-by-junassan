import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { LOOKBOOK } from "@/lib/lookbook";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Seasonal edits styled by the Closet team. Mood, palette, story — shop each look.",
};

export default function LookbookPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
        <Reveal>
          <p className="eyebrow mb-4">Seasonal edits</p>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
            The Lookbook.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Four edits. Each one built around a Pakistani city, a colour story, and the moments we&apos;re dressing for right now.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl space-y-20 px-4 pb-24 sm:px-6">
        {LOOKBOOK.map((look, idx) => {
          const flip = idx % 2 === 1;
          return (
            <Reveal key={look.slug} delay={idx * 60}>
              <article className={`grid gap-8 lg:grid-cols-2 lg:items-stretch ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <Link
                  href={`/shop`}
                  className="relative aspect-4/5 overflow-hidden rounded-3xl bg-cream"
                >
                  <Image
                    src={look.cover}
                    alt={look.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent p-6 text-paper">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70">{`Edit 0${idx + 1}`}</p>
                    <h2 className="mt-1 font-display text-4xl font-semibold sm:text-5xl">{look.title}</h2>
                  </div>
                </Link>
                <div className="flex flex-col justify-center rounded-3xl border border-border bg-paper p-8 sm:p-10">
                  <p className="eyebrow mb-2">{look.subtitle}</p>
                  <p className="font-display text-2xl leading-snug sm:text-3xl">{look.mood}</p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{look.story}</p>
                  <div className="mt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Colour palette
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      {look.palette.map((c) => (
                        <span
                          key={c}
                          aria-label={c}
                          title={c}
                          className="h-10 w-10 rounded-full border border-border shadow-inner"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/shop"
                    className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper hover:opacity-90"
                  >
                    Shop the look <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}
