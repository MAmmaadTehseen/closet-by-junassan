import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

const MOODS = [
  {
    title: "Desi Minimalist",
    copy: "Quiet neutrals. Clean lines. Everyday kurta energy.",
    href: "/shop?sort=newest",
    tone: "from-[#e8e2d5] to-[#cfc6b3]",
    emoji: "◌",
  },
  {
    title: "Campus Cool",
    copy: "Hoodies, wide-legs, shoes that say 'Tuesday 9am lecture'.",
    href: "/category/men",
    tone: "from-[#1c1917] to-[#0a0a0a] text-paper",
    emoji: "✺",
  },
  {
    title: "Mehndi Nights",
    copy: "Statement kurtas, embroidered vibes, tea-party ready.",
    href: "/category/women",
    tone: "from-[#c1121f] to-[#7a0a12] text-paper",
    emoji: "❁",
  },
  {
    title: "Thrift Sneakerhead",
    copy: "Wear-tested kicks that still have thousands of miles left.",
    href: "/category/shoes",
    tone: "from-[#f1ede4] to-[#e8e2d5]",
    emoji: "▲",
  },
];

export default function ShopByMood() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Shop by mood</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Pick the vibe. We&apos;ll handle the fit.
            </h2>
          </div>
          <Link
            href="/collections"
            className="underline-sweep inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
          >
            All collections <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOODS.map((m, i) => (
          <Reveal key={m.title} delay={i * 80}>
            <TiltCard className="h-full">
              <Link
                href={m.href}
                className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${m.tone} p-6 min-h-[240px] hover-lift`}
              >
                <span
                  aria-hidden
                  className="text-5xl leading-none opacity-70 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                >
                  {m.emoji}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold leading-tight">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-[13px] opacity-80">{m.copy}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.22em] opacity-90">
                    Browse <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
