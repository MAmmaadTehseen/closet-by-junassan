import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Truck, Sparkles } from "lucide-react";
import Marquee from "@/components/ui/Marquee";

const COLLAGE = [
  "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-paper">
      <div className="pointer-events-none absolute inset-0 noise opacity-40" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-16 pb-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pt-24 lg:pb-20">
        <div className="animate-fade-up">
          <p className="eyebrow">Curated Thrift · Weekly Drops</p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.015em] sm:text-5xl md:text-6xl lg:text-7xl">
            Affordable{" "}
            <span className="italic text-ink/80">Branded</span> Fashion
            <br />
            for Everyone.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Hand-picked preloved pieces from the brands you love — delivered across Pakistan
            with Cash on Delivery. Men · Women · Kids · Shoes · Bags.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
            >
              Shop the Drop
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 rounded-full border border-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
            >
              Under 2000 PKR
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Star className="h-3.5 w-3.5 fill-ink text-ink" /> 4.9 · 2k+ happy buyers
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck className="h-3.5 w-3.5" /> COD all over Pakistan
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" /> New drops weekly
            </span>
          </div>
        </div>

        <div className="relative mx-auto flex h-85 w-full max-w-130 items-center justify-center sm:h-115 lg:h-130">
          <div className="absolute left-[8%] top-[4%] h-[56%] w-[48%] rotate-[-5deg] overflow-hidden rounded-2xl border border-border bg-cream shadow-2xl transition hover:rotate-[-2deg]">
            <Image
              src={COLLAGE[0]}
              alt=""
              fill
              sizes="(max-width: 1024px) 50vw, 240px"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute right-[6%] top-[20%] h-[62%] w-[54%] rotate-[4deg] overflow-hidden rounded-2xl border border-border bg-cream shadow-2xl transition hover:rotate-[1deg]">
            <Image
              src={COLLAGE[1]}
              alt=""
              fill
              sizes="(max-width: 1024px) 55vw, 280px"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute bottom-[2%] left-[18%] h-[42%] w-[42%] rotate-[2deg] overflow-hidden rounded-2xl border border-border bg-cream shadow-xl transition hover:rotate-[-2deg]">
            <Image
              src={COLLAGE[2]}
              alt=""
              fill
              sizes="(max-width: 1024px) 40vw, 200px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <Marquee
        items={[
          "Free Delivery",
          "Cash on Delivery",
          "Karachi → Gilgit",
          "New drops every week",
          "Limited pieces",
          "Hand-picked finds",
        ]}
      />
    </section>
  );
}
