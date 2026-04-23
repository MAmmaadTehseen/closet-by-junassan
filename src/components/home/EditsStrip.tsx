import Link from "next/link";
import { ArrowUpRight, Layers, BookOpen, Ruler, Sparkles } from "lucide-react";

const EDITS = [
  {
    href: "/bundles",
    eyebrow: "06 · Save together",
    title: "Bundles",
    copy: "Curator-made sets. Up to 20% off when you take the whole look.",
    icon: Layers,
  },
  {
    href: "/lookbook",
    eyebrow: "07 · Mood board",
    title: "Lookbook",
    copy: "Four city edits. Each one built around a palette, a place, a night out.",
    icon: Sparkles,
  },
  {
    href: "/journal",
    eyebrow: "08 · Field notes",
    title: "Journal",
    copy: "How we source. How to care for denim. The Pakistani capsule closet.",
    icon: BookOpen,
  },
  {
    href: "/fit-finder",
    eyebrow: "09 · Zero returns",
    title: "Fit Finder",
    copy: "30 seconds. 4 questions. Your recommended size — locked in.",
    icon: Ruler,
  },
];

export default function EditsStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-2">06 · Beyond the shop</p>
          <h2 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">
            Made to be <span className="italic text-ink/70">browsed.</span>
          </h2>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {EDITS.map((e) => {
          const Icon = e.icon;
          return (
            <Link
              key={e.href}
              href={e.href}
              className="group flex h-full flex-col rounded-3xl border border-border bg-paper p-6 transition hover:-translate-y-1 hover:border-ink"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream">
                  <Icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-ink" />
              </div>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {e.eyebrow}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold">{e.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{e.copy}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
