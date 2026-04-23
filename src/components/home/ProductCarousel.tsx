"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

type Props = {
  eyebrow?: string;
  title: string;
  products: Product[];
  href?: string;
};

export default function ProductCarousel({ eyebrow, title, products, href }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {href && (
              <Link
                href={href}
                className="group hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-ink sm:inline-flex"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </Link>
            )}
            <div className="hidden gap-2 md:flex">
              <button
                onClick={() => scrollBy(-1)}
                disabled={!canPrev}
                aria-label="Previous"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-paper text-ink transition hover:bg-cream disabled:opacity-30 focus-ring"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollBy(1)}
                disabled={!canNext}
                aria-label="Next"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-paper text-ink transition hover:bg-cream disabled:opacity-30 focus-ring"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6"
      >
        {products.map((p) => (
          <div
            key={p.id}
            data-card
            className="w-[82vw] max-w-[300px] flex-shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
          >
            <ProductCard product={p} variant="carousel" />
          </div>
        ))}
      </div>
    </section>
  );
}
