"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, RotateCcw } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

type Answers = {
  for: string;
  vibe: string;
  budget: string;
};

const STEPS: {
  id: keyof Answers;
  question: string;
  options: { label: string; value: string; emoji: string }[];
}[] = [
  {
    id: "for",
    question: "Who's it for?",
    options: [
      { label: "Her", value: "women", emoji: "🌸" },
      { label: "Him", value: "men", emoji: "🧢" },
      { label: "Kids", value: "kids", emoji: "🧸" },
      { label: "Shoes", value: "shoes", emoji: "👟" },
    ],
  },
  {
    id: "vibe",
    question: "Pick a vibe.",
    options: [
      { label: "Everyday basics", value: "basics", emoji: "☕" },
      { label: "Statement piece", value: "statement", emoji: "✨" },
      { label: "Streetwear", value: "street", emoji: "🛹" },
      { label: "Workwear", value: "work", emoji: "💼" },
    ],
  },
  {
    id: "budget",
    question: "Budget range?",
    options: [
      { label: "Under Rs 2,000", value: "2000", emoji: "💸" },
      { label: "Under Rs 4,000", value: "4000", emoji: "💵" },
      { label: "Under Rs 8,000", value: "8000", emoji: "💎" },
      { label: "No limit", value: "any", emoji: "🪙" },
    ],
  },
];

function buildHref(a: Answers) {
  const params = new URLSearchParams();
  if (a.for) params.set("category", a.for);
  if (a.budget && a.budget !== "any") params.set("maxPrice", a.budget);
  if (a.vibe) params.set("q", a.vibe);
  return `/shop?${params.toString()}`;
}

export default function StyleQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ for: "", vibe: "", budget: "" });

  const current = STEPS[step];
  const done = step >= STEPS.length;

  const choose = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers({ for: "", vibe: "", budget: "" });
    setStep(0);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-cream to-paper p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="eyebrow mb-2">Style quiz · 30 seconds</p>
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Tell us your vibe.
                <br />
                We&apos;ll curate your shop.
              </h2>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                Three quick taps. No sign-up. Get a tailored grid of pieces that match exactly
                what you&apos;re hunting for.
              </p>
              <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="flex gap-1">
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-6 rounded-full transition ${
                        i < step ? "bg-ink" : i === step ? "bg-ink/60" : "bg-ink/15"
                      }`}
                    />
                  ))}
                </span>
                Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-paper p-5 sm:p-7">
              {!done ? (
                <>
                  <p className="font-display text-xl font-semibold sm:text-2xl">
                    {current.question}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    {current.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => choose(opt.value)}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-paper px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-ink"
                      >
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="text-sm font-semibold text-ink">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
                    >
                      ← Back
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="mt-4 font-display text-xl font-semibold">
                    Your curated edit is ready.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pieces filtered to your taste.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <Link
                      href={buildHref(answers)}
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:opacity-90"
                    >
                      See my edit
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-ink"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Restart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
