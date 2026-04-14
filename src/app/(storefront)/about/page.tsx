import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Recycle, Sparkles, ShieldCheck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — curated thrift fashion for Pakistan.`,
};

const VALUES = [
  { icon: Sparkles, title: "Curated", copy: "Every piece is hand-picked. No filler. No fast fashion." },
  { icon: Heart, title: "Affordable", copy: "Branded quality at prices Pakistan can actually afford." },
  { icon: Recycle, title: "Circular", copy: "Giving great pieces a second home — kinder on the planet." },
  { icon: ShieldCheck, title: "Inspected", copy: "Condition graded 1–10. What you see is exactly what you get." },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-16">
        <Reveal>
          <p className="eyebrow mb-4">Our Story</p>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-[88px]">
            We hunt down the labels you love — <span className="italic text-ink/70">and hand them on.</span>
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <Reveal>
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-3xl bg-cream">
              <Image
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1600&q=80"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex h-full flex-col justify-center">
              <p className="eyebrow mb-4">Why we do this</p>
              <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
                Good style shouldn&apos;t cost the earth. Pakistan deserves access to real
                quality without the import markup.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {siteConfig.name} started as a small weekend thrift project and grew into a
                curated store obsessed with finding the right pieces. Every drop is inspected,
                measured, photographed, and priced to move — because limited stock should mean
                limited stock.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Pay only when your order arrives. Flat delivery across Pakistan. No drama.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="eyebrow mb-2 text-center">What we stand for</p>
            <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">Our promise.</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 100}>
                  <div className="h-full rounded-2xl border border-border bg-paper p-7">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.copy}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold sm:text-5xl">
            Ready to build your closet?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper hover:opacity-90"
            >
              Shop the Drop
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-paper"
            >
              Get in Touch
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
