import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { fetchCollections } from "@/lib/collections";
import Reveal from "@/components/ui/Reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "The Collections",
  description: "Curated edits — seasonal pieces, trending finds, and editor's picks from Closet by Junassan.",
};

export default async function CollectionsIndex() {
  const collections = await fetchCollections();

  return (
    <>
      {/* Editorial masthead */}
      <section className="relative border-b border-border bg-paper">
        <div className="pointer-events-none absolute inset-0 noise opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:pt-24 lg:pb-16">
          <p className="eyebrow">Issue №01 · The Edit</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.02em] sm:text-6xl lg:text-8xl">
            Curated <span className="italic text-ink/70">edits</span> — chapters from our closet.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            Seasonal finds, staff picks, and themed stories. Each collection is a point of view —
            hand-picked and told as a chapter.
          </p>
        </div>
      </section>

      {collections.length === 0 ? (
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <p className="font-display text-2xl">No collections published yet.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Check back soon — new editorial edits drop weekly.
          </p>
          <Link
            href="/collections/all"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper hover:opacity-90"
          >
            Shop all
          </Link>
        </div>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-x-6 gap-y-20 lg:grid-cols-12">
            {collections.map((c, i) => {
              const isHero = i === 0;
              return (
                <Reveal
                  key={c.slug}
                  delay={i * 80}
                  className={
                    isHero
                      ? "lg:col-span-12"
                      : i % 3 === 1
                        ? "lg:col-span-7"
                        : "lg:col-span-5"
                  }
                >
                  <Link href={`/collections/${c.slug}`} className="group block focus-ring">
                    <div
                      className={`relative overflow-hidden rounded-3xl bg-cream ${
                        isHero ? "aspect-video" : "aspect-4/5"
                      }`}
                    >
                      {c.cover_image && (
                        <Image
                          src={c.cover_image}
                          alt={c.title}
                          fill
                          sizes={isHero ? "(max-width: 1024px) 100vw, 1200px" : "(max-width: 1024px) 100vw, 50vw"}
                          priority={i < 2}
                          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                        />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6 text-paper sm:p-10">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-paper/80">
                          Ch. {String(i + 1).padStart(2, "0")}
                        </p>
                        <h2
                          className={`mt-3 font-display font-semibold leading-[1.02] tracking-[-0.015em] ${
                            isHero ? "text-5xl sm:text-6xl lg:text-7xl" : "text-3xl sm:text-4xl"
                          }`}
                        >
                          {c.title}
                        </h2>
                        {c.subtitle && (
                          <p className="mt-3 max-w-md text-sm text-paper/85">{c.subtitle}</p>
                        )}
                        <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]">
                          Enter the chapter <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
