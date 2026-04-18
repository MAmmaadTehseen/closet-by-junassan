import Link from "next/link";
import { ArrowRight, Star, Truck, Sparkles } from "lucide-react";
import Marquee from "@/components/ui/Marquee";
import MagneticButton from "@/components/ui/MagneticButton";
import HeroCollage from "@/components/home/HeroCollage";
import { getSetting, MARQUEE_KEY, DEFAULT_MARQUEE } from "@/lib/site-settings";
import { getT } from "@/lib/i18n";

export default async function Hero() {
  const marqueeItems = await getSetting<string[]>(MARQUEE_KEY, DEFAULT_MARQUEE);
  const t = await getT();
  return (
    <section className="relative overflow-hidden border-b border-border bg-paper">
      <div className="pointer-events-none absolute inset-0 noise opacity-40" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-16 pb-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pt-24 lg:pb-20">
        <div className="animate-fade-up">
          <p className="eyebrow">{t("hero.eyebrow")}</p>
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
            <MagneticButton>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
              >
                {t("hero.cta_primary")}
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 rounded-full border border-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
              >
                {t("hero.cta_secondary")}
              </Link>
            </MagneticButton>
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

        <HeroCollage />
      </div>

      <Marquee items={marqueeItems} />
    </section>
  );
}
