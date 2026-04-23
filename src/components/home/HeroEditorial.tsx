import Link from "next/link";
import { ArrowRight, Star, Truck, Sparkles } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import HeroSpotlight from "@/components/home/HeroSpotlight";
import { getT } from "@/lib/i18n-server";

export default async function HeroEditorial() {
  const t = await getT();
  return (
    <section className="relative overflow-hidden border-b border-border bg-paper">
      <HeroSpotlight />
      <div className="pointer-events-none absolute inset-0 noise opacity-30" aria-hidden />

      <div className="relative mx-auto flex min-h-[calc(100dvh-64px)] max-w-7xl flex-col justify-center px-4 pt-20 pb-24 sm:px-6 lg:px-8">
        <p className="eyebrow animate-fade-up">{t("hero.eyebrow")}</p>
        <h1
          className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.02em] sm:text-7xl lg:text-[clamp(4rem,9vw,8.5rem)] animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          {t("hero.headline_a")}
          <br />
          <span className="italic text-ink/80">{t("hero.headline_b")}</span>
        </h1>
        <p
          className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          {t("hero.subheading")}
        </p>

        <div
          className="mt-10 flex flex-wrap items-center gap-3 animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <MagneticButton>
            <Link
              href="/collections/all"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-paper transition hover:opacity-90 focus-ring"
            >
              {t("hero.cta_primary")}
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 rounded-full border border-ink px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-paper focus-ring"
            >
              {t("hero.cta_secondary")}
            </Link>
          </MagneticButton>
        </div>

        <div
          className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground animate-fade-up"
          style={{ animationDelay: "320ms" }}
        >
          <span className="inline-flex items-center gap-2">
            <Star className="h-3.5 w-3.5 fill-ink text-ink" /> {t("hero.stat_rating")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Truck className="h-3.5 w-3.5" /> {t("hero.stat_cod")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> {t("hero.stat_drops")}
          </span>
        </div>
      </div>
    </section>
  );
}
