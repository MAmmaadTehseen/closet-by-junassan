import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchProducts } from "@/lib/products";
import { formatPKR } from "@/lib/format";
import type { Product } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "Editorial outfit stories — see how to wear our latest thrift finds in head-to-toe looks.",
};

interface Look {
  title: string;
  eyebrow: string;
  copy: string;
  vibe: "weekend" | "studio" | "evening" | "office";
  pickCategories: string[];
}

const LOOKS: Look[] = [
  {
    title: "Sunday in Lahore",
    eyebrow: "Look 01",
    copy: "Soft denim, a vintage tee and walk-the-park sneakers — built for chai stops.",
    vibe: "weekend",
    pickCategories: ["men", "shoes"],
  },
  {
    title: "Studio Hours",
    eyebrow: "Look 02",
    copy: "Linen shirts, pleated skirts and a structured tote that earns its keep.",
    vibe: "studio",
    pickCategories: ["women", "bags"],
  },
  {
    title: "Karachi After Dark",
    eyebrow: "Look 03",
    copy: "Slip dress, cashmere layer, statement bag — for the night that goes long.",
    vibe: "evening",
    pickCategories: ["women", "bags", "shoes"],
  },
  {
    title: "Office, but Make it Yours",
    eyebrow: "Look 04",
    copy: "Polo, tailored trousers and clean leather loafers — meeting-room ready.",
    vibe: "office",
    pickCategories: ["men", "shoes", "bags"],
  },
];

function pickForLook(all: Product[], look: Look): Product[] {
  const used = new Set<string>();
  const out: Product[] = [];
  for (const cat of look.pickCategories) {
    const next = all.find((p) => p.category === cat && !used.has(p.id));
    if (next) {
      used.add(next.id);
      out.push(next);
    }
  }
  // Top up to 3 with anything left if we came up short.
  if (out.length < 3) {
    for (const p of all) {
      if (used.has(p.id)) continue;
      out.push(p);
      used.add(p.id);
      if (out.length >= 3) break;
    }
  }
  return out.slice(0, 3);
}

export default async function LookbookPage() {
  const all = await fetchProducts({ limit: 60 });

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <p className="eyebrow mb-2">Style stories</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">Lookbook</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Curated outfits built around our newest pieces. Click any item to shop the look — every
          piece is one-of-one.
        </p>
      </div>

      <div className="space-y-20">
        {LOOKS.map((look, idx) => {
          const picks = pickForLook(all, look);
          if (picks.length === 0) return null;
          const total = picks.reduce((n, p) => n + p.price_pkr, 0);
          const reverse = idx % 2 === 1;
          const hero = picks[0];
          return (
            <section
              key={look.title}
              className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12"
            >
              <div className={`${reverse ? "lg:order-2" : ""}`}>
                <Link
                  href={`/product/${hero.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-cream"
                >
                  {hero.images[0] && (
                    <Image
                      src={hero.images[0]}
                      alt={hero.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  )}
                  <span className="absolute left-5 top-5 rounded-full bg-paper/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink backdrop-blur">
                    {look.eyebrow}
                  </span>
                </Link>
              </div>
              <div className={`flex flex-col justify-center ${reverse ? "lg:order-1" : ""}`}>
                <p className="eyebrow mb-2">{look.eyebrow}</p>
                <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  {look.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{look.copy}</p>
                <ul className="mt-6 space-y-3">
                  {picks.map((p) => (
                    <li
                      key={p.id}
                      className="group flex items-center gap-4 rounded-2xl border border-border bg-paper p-3 transition hover:border-ink"
                    >
                      <Link
                        href={`/product/${p.slug}`}
                        className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-cream"
                      >
                        {p.images[0] && (
                          <Image src={p.images[0]} alt={p.name} fill sizes="56px" className="object-cover" />
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          {p.brand}
                        </p>
                        <Link
                          href={`/product/${p.slug}`}
                          className="line-clamp-1 text-sm font-medium hover:underline"
                        >
                          {p.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{formatPKR(p.price_pkr)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between rounded-2xl bg-cream px-5 py-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Look total
                    </p>
                    <p className="font-display text-2xl font-semibold">{formatPKR(total)}</p>
                  </div>
                  <Link
                    href={`/shop?category=${look.pickCategories[0]}`}
                    className="rounded-full bg-ink px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-paper"
                  >
                    Shop the vibe
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
