import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JOURNAL } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Style, sourcing, care and stories from the team behind Closet by Junassan.",
};

export default function JournalPage() {
  const [featured, ...rest] = JOURNAL;
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2">Journal</p>
        <h1 className="font-display text-3xl font-semibold sm:text-5xl">
          Style, sourcing, stories.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Notes from our stylists, the warehouse team, and the community wearing our finds.
        </p>
      </div>

      {featured && (
        <Link
          href={`/journal/${featured.slug}`}
          className="group relative mb-12 block overflow-hidden rounded-3xl bg-cream focus-ring"
        >
          <div className="relative aspect-[21/9] w-full">
            <Image
              src={featured.cover}
              alt={featured.title}
              fill
              sizes="100vw"
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-paper sm:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
              {featured.category} · {featured.readMinutes} min read
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
              {featured.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm opacity-85">{featured.dek}</p>
          </div>
        </Link>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link
            key={p.slug}
            href={`/journal/${p.slug}`}
            className="group block focus-ring"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream">
              <Image
                src={p.cover}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {p.category} · {p.readMinutes} min
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold leading-tight">{p.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
