import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { JOURNAL } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Style notes, care guides, and behind-the-scenes from the Closet team.",
};

export default function JournalPage() {
  const [hero, ...rest] = JOURNAL;
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 sm:pt-24">
        <Reveal>
          <p className="eyebrow mb-4">Style notes</p>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
            The Journal.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            How we buy, how we wear it, how to keep it looking new. Short, practical, and local to Pakistan.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <Reveal>
          <Link
            href={`/journal/${hero.slug}`}
            className="group grid gap-6 rounded-3xl border border-border bg-paper p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:items-center"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-cream">
              <Image src={hero.cover} alt={hero.title} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {hero.tag} · {hero.readTime} min read
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-5xl">{hero.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{hero.excerpt}</p>
              <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
                Read article <ArrowRight className="h-3.5 w-3.5" />
              </p>
            </div>
          </Link>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link href={`/journal/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream">
                  <Image src={p.cover} alt={p.title} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {p.tag} · {p.readTime} min
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold leading-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
