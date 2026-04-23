"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Ruler } from "lucide-react";
import Link from "next/link";

type Answer = {
  height: "s" | "m" | "l" | "xl";
  chest: "s" | "m" | "l" | "xl";
  waist: "s" | "m" | "l" | "xl";
  fit: "slim" | "regular" | "relaxed";
};

const QUESTIONS = [
  {
    key: "height" as const,
    title: "Your height?",
    options: [
      { key: "s",  label: "Under 5'4\"" },
      { key: "m",  label: "5'4\" – 5'7\"" },
      { key: "l",  label: "5'7\" – 5'10\"" },
      { key: "xl", label: "Over 5'10\"" },
    ],
  },
  {
    key: "chest" as const,
    title: "Chest measurement (inches)?",
    options: [
      { key: "s",  label: "Under 36\"" },
      { key: "m",  label: "36\" – 39\"" },
      { key: "l",  label: "40\" – 43\"" },
      { key: "xl", label: "44\" and up" },
    ],
  },
  {
    key: "waist" as const,
    title: "Waist measurement (inches)?",
    options: [
      { key: "s",  label: "Under 28\"" },
      { key: "m",  label: "28\" – 31\"" },
      { key: "l",  label: "32\" – 35\"" },
      { key: "xl", label: "36\" and up" },
    ],
  },
  {
    key: "fit" as const,
    title: "Preferred fit?",
    options: [
      { key: "slim",    label: "Slim / tailored" },
      { key: "regular", label: "Regular / true-to-size" },
      { key: "relaxed", label: "Relaxed / oversized" },
    ],
  },
] as const;

const SIZE_MAP = { s: 0, m: 1, l: 2, xl: 3 } as const;
const SIZE_LABEL = ["S", "M", "L", "XL"] as const;

function recommend(a: Answer) {
  const chest = SIZE_MAP[a.chest];
  const waist = SIZE_MAP[a.waist];
  let base = Math.max(chest, waist);
  if (a.fit === "slim" && base > 0) base -= 1;
  if (a.fit === "relaxed" && base < 3) base += 1;
  return SIZE_LABEL[base];
}

export default function FitFinderClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answer>>({});
  const [done, setDone] = useState(false);

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = done ? 100 : Math.round((step / total) * 100);

  const pick = (val: string) => {
    const next = { ...answers, [q.key]: val } as Partial<Answer>;
    setAnswers(next);
    if (step + 1 < total) setStep(step + 1);
    else setDone(true);
  };

  if (done) {
    const size = recommend(answers as Answer);
    return (
      <div className="rounded-3xl border border-border bg-cream/60 p-8 text-center sm:p-14">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
          <Check className="h-6 w-6" />
        </div>
        <p className="eyebrow mt-6">Your recommended size</p>
        <p className="mt-3 font-display text-7xl font-semibold sm:text-8xl">{size}</p>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          Based on your height, chest, waist, and fit preference. Double-check the measurements on each product page — every thrifted piece is unique.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link
            href={`/shop?size=${encodeURIComponent(size)}`}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper hover:opacity-90"
          >
            Shop size {size}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => { setStep(0); setAnswers({}); setDone(false); }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] hover:border-ink"
          >
            Start over
          </button>
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
        <Ruler className="h-6 w-6 text-muted-foreground" />
        {q.title}
      </h2>
      <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
        {q.options.map((o) => (
          <li key={o.key}>
            <button
              onClick={() => pick(o.key)}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-cream/50 px-5 py-4 text-left text-sm font-medium transition hover:border-ink hover:bg-cream"
            >
              {o.label}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>
      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-6 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      )}
    </div>
  );
}
