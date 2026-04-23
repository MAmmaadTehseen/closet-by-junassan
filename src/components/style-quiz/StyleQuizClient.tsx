"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

type ArchetypeKey = "minimalist" | "streetwear" | "classic" | "romantic" | "eclectic";

interface Option {
  label: string;
  weight: Partial<Record<ArchetypeKey, number>>;
}

interface Question {
  key: string;
  title: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    key: "palette",
    title: "Your dream closet palette?",
    options: [
      { label: "Ivory, stone, charcoal",       weight: { minimalist: 3, classic: 2 } },
      { label: "Black, white, acid pops",      weight: { streetwear: 3, eclectic: 1 } },
      { label: "Navy, camel, olive",           weight: { classic: 3, minimalist: 1 } },
      { label: "Rose, cream, lavender",        weight: { romantic: 3 } },
      { label: "All the colours. All of them.",weight: { eclectic: 3, romantic: 1 } },
    ],
  },
  {
    key: "shape",
    title: "Go-to silhouette?",
    options: [
      { label: "Clean, tailored, nothing extra",     weight: { minimalist: 3, classic: 2 } },
      { label: "Oversized, baggy, layered",          weight: { streetwear: 3, eclectic: 1 } },
      { label: "Cinched waist, flowing fabrics",     weight: { romantic: 3 } },
      { label: "Sharp blazers, straight-leg",        weight: { classic: 3, minimalist: 1 } },
      { label: "Anything with a print",              weight: { eclectic: 3 } },
    ],
  },
  {
    key: "saturday",
    title: "Saturday morning vibe?",
    options: [
      { label: "White tee, raw denim, fresh kicks",  weight: { minimalist: 3, classic: 1 } },
      { label: "Hoodie, cargos, headphones",         weight: { streetwear: 3 } },
      { label: "Linen shirt, loafers, coffee",       weight: { classic: 3, minimalist: 1 } },
      { label: "Slip dress, cardigan, walk",         weight: { romantic: 3 } },
      { label: "Mix-and-matched vintage layers",     weight: { eclectic: 3 } },
    ],
  },
  {
    key: "pet-peeve",
    title: "Biggest style pet peeve?",
    options: [
      { label: "Logos. Loud ones.",                 weight: { minimalist: 3, classic: 1 } },
      { label: "Fast-fashion tailoring",            weight: { classic: 3 } },
      { label: "Boring basics",                     weight: { streetwear: 2, eclectic: 3 } },
      { label: "Itchy fabric",                      weight: { romantic: 3, minimalist: 1 } },
      { label: "Matchy-matchy outfits",             weight: { eclectic: 3, streetwear: 1 } },
    ],
  },
  {
    key: "splurge",
    title: "Where would you splurge?",
    options: [
      { label: "The perfect wool coat",             weight: { classic: 3, minimalist: 2 } },
      { label: "Rare hype sneakers",                weight: { streetwear: 3 } },
      { label: "Handmade jewellery",                weight: { romantic: 3, eclectic: 2 } },
      { label: "Italian leather bag",               weight: { classic: 3 } },
      { label: "A one-off vintage find",            weight: { eclectic: 3 } },
    ],
  },
];

const ARCHETYPES: Record<ArchetypeKey, {
  title: string;
  tagline: string;
  copy: string;
  accent: string;
  palette: string[];
  shopHref: string;
  keywords: string[];
}> = {
  minimalist: {
    title: "The Minimalist",
    tagline: "Less, but better.",
    copy: "You go quiet and confident. Neutral tones, crisp lines, premium fabrics. You&apos;d rather buy one great piece than five okay ones.",
    accent: "from-[#0a0a0a] to-[#2a2420]",
    palette: ["#0a0a0a", "#faf9f6", "#c0a26b"],
    shopHref: "/shop?sort=newest",
    keywords: ["beige", "ivory", "black", "wool", "linen"],
  },
  streetwear: {
    title: "The Streetwear Kid",
    tagline: "Comfort is the flex.",
    copy: "Oversized shapes, heavy fabrics, loud kicks. You dress for the city and you curate over labels.",
    accent: "from-[#c1121f] to-[#0a0a0a]",
    palette: ["#0a0a0a", "#c1121f", "#faf9f6"],
    shopHref: "/shop?category=men",
    keywords: ["hoodie", "cargos", "sneakers", "oversized"],
  },
  classic: {
    title: "The Classic",
    tagline: "Timeless, on purpose.",
    copy: "You dress like it&apos;s 1998 and 2028 at the same time. Tailoring, heritage prints, leather you&apos;ll wear for a decade.",
    accent: "from-[#2f3e2b] to-[#1c1917]",
    palette: ["#2f3e2b", "#c0a26b", "#faf9f6"],
    shopHref: "/shop?sort=price-desc",
    keywords: ["blazer", "loafers", "trench", "navy"],
  },
  romantic: {
    title: "The Romantic",
    tagline: "Soft, feminine, unbothered.",
    copy: "Fabrics you want to touch. Silhouettes that move. You read in cafés and you own more candles than shoes.",
    accent: "from-[#e2a36c] to-[#c1121f]",
    palette: ["#f1ede4", "#e2a36c", "#c1121f"],
    shopHref: "/shop?category=women",
    keywords: ["dress", "silk", "satin", "lace"],
  },
  eclectic: {
    title: "The Eclectic",
    tagline: "Rules are a suggestion.",
    copy: "You mix prints, eras, and cities. Your closet is a scrapbook — and somehow it all works.",
    accent: "from-[#f59e0b] to-[#c1121f]",
    palette: ["#f59e0b", "#c1121f", "#2f3e2b"],
    shopHref: "/shop",
    keywords: ["print", "vintage", "embroidery", "colour"],
  },
};

export default function StyleQuizClient() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<ArchetypeKey, number>>({
    minimalist: 0, streetwear: 0, classic: 0, romantic: 0, eclectic: 0,
  });
  const [done, setDone] = useState(false);

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = done ? 100 : Math.round((step / total) * 100);

  const pick = (o: Option) => {
    const next = { ...scores };
    for (const k in o.weight) {
      const key = k as ArchetypeKey;
      next[key] += o.weight[key] ?? 0;
    }
    setScores(next);
    if (step + 1 < total) setStep(step + 1);
    else setDone(true);
  };

  if (done) {
    const top = (Object.entries(scores) as [ArchetypeKey, number][])
      .sort((a, b) => b[1] - a[1])[0][0];
    const a = ARCHETYPES[top];

    return (
      <div className="overflow-hidden rounded-3xl border border-border">
        <div className={`relative bg-gradient-to-br ${a.accent} p-10 text-paper sm:p-14`}>
          <div className="pointer-events-none absolute inset-0 noise opacity-15" aria-hidden />
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70">
            Your archetype
          </p>
          <h2 className="relative mt-3 font-display text-5xl font-semibold leading-tight sm:text-7xl">
            {a.title}
          </h2>
          <p className="relative mt-3 text-sm italic text-paper/80">{a.tagline}</p>
          <p className="relative mt-6 max-w-lg text-sm leading-relaxed text-paper/90">{a.copy}</p>
          <div className="relative mt-7 flex items-center gap-2">
            {a.palette.map((c) => (
              <span
                key={c}
                className="h-8 w-8 rounded-full border-2 border-paper/40"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 bg-paper p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            {a.keywords.map((k) => (
              <span key={k} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest">
                {k}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setScores({ minimalist: 0, streetwear: 0, classic: 0, romantic: 0, eclectic: 0 });
                setStep(0); setDone(false);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-widest hover:border-ink"
            >
              Retake
            </button>
            <Link
              href={a.shopHref}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper hover:opacity-90"
            >
              Shop your archetype <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-paper p-6 sm:p-10">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Step {step + 1} of {total}
        </p>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-cream">
          <div className="h-full bg-ink transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <h2 className="flex items-center gap-3 font-display text-3xl font-semibold sm:text-4xl">
        <Sparkles className="h-6 w-6 text-muted-foreground" />
        {q.title}
      </h2>
      <ul className="mt-8 grid gap-2.5">
        {q.options.map((o) => (
          <li key={o.label}>
            <button
              onClick={() => pick(o)}
              className="group flex w-full items-center justify-between rounded-2xl border border-border bg-cream/40 px-5 py-4 text-left text-sm font-medium transition hover:border-ink hover:bg-cream"
            >
              <span>{o.label}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border transition group-hover:bg-ink group-hover:text-paper">
                <Check className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
