import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/60 to-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Curated Thrift — New Drops Weekly
        </span>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl animate-fade-up">
          Affordable Branded Fashion for Everyone
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Men • Women • Kids • Shoes • Bags
        </p>
        <Link
          href="/shop"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90"
        >
          Shop Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
