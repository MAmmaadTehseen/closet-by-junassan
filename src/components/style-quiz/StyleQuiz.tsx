"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import type { Product } from "@/lib/types";
import type { CategoryDef } from "@/lib/categories";

type Answer = string;

interface Question {
  id: string;
  prompt: string;
  options: { value: string; label: string }[];
}

const QUESTIONS = (categories: CategoryDef[]): Question[] => [
  {
    id: "audience",
    prompt: "Who are you shopping for?",
    options: categories.length
      ? categories.map((c) => ({ value: c.slug, label: c.label }))
      : [
          { value: "men", label: "Men" },
          { value: "women", label: "Women" },
          { value: "kids", label: "Kids" },
        ],
  },
  {
    id: "vibe",
    prompt: "What's your vibe today?",
    options: [
      { value: "minimal", label: "Minimal & neutral" },
      { value: "street", label: "Streetwear" },
      { value: "vintage", label: "Vintage finds" },
      { value: "smart", label: "Smart casual" },
    ],
  },
  {
    id: "size",
    prompt: "Pick your usual size",
    options: [
      { value: "S", label: "S" },
      { value: "M", label: "M" },
      { value: "L", label: "L" },
      { value: "XL", label: "XL" },
    ],
  },
  {
    id: "budget",
    prompt: "Comfort budget per piece?",
    options: [
      { value: "1500", label: "Under Rs 1,500" },
      { value: "3000", label: "Under Rs 3,000" },
      { value: "5000", label: "Under Rs 5,000" },
      { value: "any", label: "No limit" },
    ],
  },
  {
    id: "wear",
    prompt: "When are you wearing it?",
    options: [
      { value: "everyday", label: "Everyday basics" },
      { value: "outing", label: "Going out" },
      { value: "work", label: "Work / smart" },
      { value: "occasion", label: "An occasion" },
    ],
  },
];

export default function StyleQuiz({
  products,
  categories,
}: {
  products: Product[];
  categories: CategoryDef[];
}) {
  const questions = useMemo(() => QUESTIONS(categories), [categories]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const done = step >= questions.length;

  const matches = useMemo(() => {
    if (!done) return [];
    const cat = answers.audience;
    const size = answers.size;
    const budget = answers.budget;
    const max = budget === "any" ? Infinity : Number(budget);
    let pool = products.filter((p) => (cat ? p.category === cat : true));
    if (size) {
      const fitsSize = pool.filter((p) => p.size === size);
      if (fitsSize.length >= 4) pool = fitsSize;
    }
    pool = pool.filter((p) => p.price_pkr <= max);
    if (pool.length < 4) {
      pool = products.filter((p) => p.category === cat && p.price_pkr <= max);
    }
    return pool.slice(0, 8);
  }, [products, answers, done]);

  const choose = (value: Answer) => {
    setAnswers((s) => ({ ...s, [questions[step].id]: value }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  if (done) {
    return (
      <div>
        <div className="mb-8 rounded-2xl border border-border bg-cream/40 p-6 text-center">
          <Sparkles className="mx-auto h-5 w-5 text-amber-500" />
          <h2 className="mt-2 font-display text-2xl font-semibold">
            Your curated edit, {answers.vibe ?? ""}!
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {matches.length} pieces matched — every one in stock and ships COD.
          </p>
          <button
            onClick={reset}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-paper px-5 py-2.5 text-xs font-semibold uppercase tracking-widest hover:border-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Retake quiz
          </button>
        </div>
        {matches.length > 0 ? (
          <ProductGrid products={matches} />
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No exact matches — we&apos;ll WhatsApp you when something fits.
          </p>
        )}
      </div>
    );
  }

  const q = questions[step];
  const pct = Math.round(((step + 1) / questions.length) * 100);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <span>
            Q{step + 1} of {questions.length}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-cream">
          <div
            className="h-full rounded-full bg-ink transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-paper p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{q.prompt}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {q.options.map((o) => (
            <button
              key={o.value}
              onClick={() => choose(o.value)}
              className="rounded-xl border border-border bg-paper p-4 text-left text-sm font-medium hover:border-ink hover:bg-cream/40"
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between text-xs">
          <button
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink disabled:opacity-30"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          <button
            disabled={!answers[q.id]}
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink disabled:opacity-30"
          >
            Skip <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
