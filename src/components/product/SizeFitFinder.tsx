"use client";

import { useEffect, useState } from "react";
import { Ruler, ArrowRight, ArrowLeft, Check, X, Sparkles } from "lucide-react";
import Modal from "@/components/ui/Modal";

type Gender = "women" | "men" | "unisex";
type FitPref = "slim" | "regular" | "relaxed";
type UnitSystem = "cm" | "in";

interface Answers {
  gender: Gender | null;
  height: number; // cm
  weight: number; // kg
  chest: number; // cm
  waist: number; // cm
  fitPref: FitPref | null;
  unit: UnitSystem;
}

const DEFAULTS: Answers = {
  gender: null,
  height: 170,
  weight: 65,
  chest: 96,
  waist: 80,
  fitPref: null,
  unit: "cm",
};

const STORAGE = "closet-size-profile";

function recommendSize(a: Answers): { size: string; confidence: "low" | "medium" | "high"; note: string } {
  // Simple heuristics: bucket by chest + fit preference.
  const chest = a.chest;
  let base: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  if (chest < 86) base = "XS";
  else if (chest < 94) base = "S";
  else if (chest < 102) base = "M";
  else if (chest < 110) base = "L";
  else if (chest < 118) base = "XL";
  else base = "XXL";

  const ladder: ("XS" | "S" | "M" | "L" | "XL" | "XXL")[] = ["XS", "S", "M", "L", "XL", "XXL"];
  const idx = ladder.indexOf(base);

  let finalIdx = idx;
  if (a.fitPref === "relaxed") finalIdx = Math.min(ladder.length - 1, idx + 1);
  if (a.fitPref === "slim") finalIdx = Math.max(0, idx - 1);
  const size = ladder[finalIdx];

  const bmi = a.weight / Math.pow(a.height / 100, 2);
  let confidence: "low" | "medium" | "high" = "medium";
  if (bmi > 30 || bmi < 17) confidence = "low";
  else if (a.fitPref) confidence = "high";

  const note =
    a.fitPref === "relaxed"
      ? "Sized up one step for an oversized, easy drape."
      : a.fitPref === "slim"
        ? "Sized down one step for a closer, tailored fit."
        : "Standard fit based on chest measurement.";

  return { size, confidence, note };
}

function cmToIn(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}
function inToCm(inches: number): number {
  return Math.round(inches * 2.54);
}

export default function SizeFitFinder({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(DEFAULTS);
  const [result, setResult] = useState<ReturnType<typeof recommendSize> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setA({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const go = (d: 1 | -1) => setStep((s) => Math.max(0, Math.min(4, s + d)));

  const compute = () => {
    const r = recommendSize(a);
    setResult(r);
    setStep(4);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(a));
    } catch {}
  };

  const reset = () => {
    setResult(null);
    setStep(0);
  };

  const toggleUnit = () => {
    setA((prev) => ({ ...prev, unit: prev.unit === "cm" ? "in" : "cm" }));
  };

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-ink hover:text-ink"
        >
          <Ruler className="h-3 w-3" /> Find my size
        </button>
      )}
      <Modal open={open} onClose={() => setOpen(false)} maxWidth="max-w-xl">
        <div className="p-6 sm:p-8">
          <h2 className="sr-only">Find your size</h2>
          <div className="mb-5 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= step ? "bg-ink" : "bg-cream"}`}
              />
            ))}
          </div>

          {step === 0 && (
            <div>
              <p className="eyebrow mb-2">Step 1 · Who is this for?</p>
              <h3 className="font-display text-2xl font-semibold">What do you shop?</h3>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {(["women", "men", "unisex"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setA((prev) => ({ ...prev, gender: g }));
                      go(1);
                    }}
                    className={`rounded-2xl border px-4 py-4 text-sm font-semibold capitalize transition ${
                      a.gender === g ? "border-ink bg-ink text-paper" : "border-border hover:border-ink"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="eyebrow mb-2">Step 2 · Basic info</p>
              <h3 className="font-display text-2xl font-semibold">Height & weight</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <NumberField
                  label={`Height (${a.unit})`}
                  value={a.unit === "cm" ? a.height : cmToIn(a.height)}
                  onChange={(v) =>
                    setA((prev) => ({
                      ...prev,
                      height: prev.unit === "cm" ? v : inToCm(v),
                    }))
                  }
                  min={a.unit === "cm" ? 130 : 51}
                  max={a.unit === "cm" ? 210 : 83}
                />
                <NumberField
                  label="Weight (kg)"
                  value={a.weight}
                  onChange={(v) => setA((prev) => ({ ...prev, weight: v }))}
                  min={30}
                  max={160}
                />
              </div>
              <button
                onClick={toggleUnit}
                className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-ink"
              >
                Switch to {a.unit === "cm" ? "inches" : "centimetres"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="eyebrow mb-2">Step 3 · Measurements</p>
              <h3 className="font-display text-2xl font-semibold">Chest & waist</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Measure around the fullest part of your chest and natural waist.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <NumberField
                  label={`Chest (${a.unit})`}
                  value={a.unit === "cm" ? a.chest : cmToIn(a.chest)}
                  onChange={(v) =>
                    setA((prev) => ({
                      ...prev,
                      chest: prev.unit === "cm" ? v : inToCm(v),
                    }))
                  }
                  min={a.unit === "cm" ? 70 : 27}
                  max={a.unit === "cm" ? 140 : 55}
                />
                <NumberField
                  label={`Waist (${a.unit})`}
                  value={a.unit === "cm" ? a.waist : cmToIn(a.waist)}
                  onChange={(v) =>
                    setA((prev) => ({
                      ...prev,
                      waist: prev.unit === "cm" ? v : inToCm(v),
                    }))
                  }
                  min={a.unit === "cm" ? 55 : 22}
                  max={a.unit === "cm" ? 130 : 51}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="eyebrow mb-2">Step 4 · How do you like it?</p>
              <h3 className="font-display text-2xl font-semibold">Fit preference</h3>
              <div className="mt-5 grid grid-cols-1 gap-2">
                {(
                  [
                    { id: "slim", label: "Slim — close to the body" },
                    { id: "regular", label: "Regular — true to size" },
                    { id: "relaxed", label: "Relaxed — easy & oversized" },
                  ] as { id: FitPref; label: string }[]
                ).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setA((prev) => ({ ...prev, fitPref: f.id }));
                    }}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
                      a.fitPref === f.id ? "border-ink bg-ink text-paper" : "border-border hover:border-ink"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && result && (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="eyebrow mt-4">Your recommended size</p>
              <p className="mt-2 font-display text-6xl font-semibold">{result.size}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Confidence:{" "}
                <span className="font-semibold text-ink capitalize">{result.confidence}</span>
              </p>
              <p className="mx-auto mt-4 max-w-sm text-sm">{result.note}</p>
              <div className="mt-5 flex justify-center gap-2">
                <button
                  onClick={reset}
                  className="rounded-full border border-ink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper"
                >
                  Retake
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-ink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-paper hover:opacity-90"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => go(-1)}
                disabled={step === 0}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground disabled:opacity-40"
              >
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
              {step === 3 ? (
                <button
                  onClick={compute}
                  disabled={!a.fitPref}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-paper disabled:opacity-40"
                >
                  <Check className="h-3 w-3" /> Get my size
                </button>
              ) : (
                <button
                  onClick={() => go(1)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-paper hover:opacity-90"
                >
                  Next <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-1.5 block">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-paper px-3 py-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="rounded-full p-1 hover:bg-cream"
          aria-label="Decrease"
        >
          <X className="h-3 w-3 rotate-45" />
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent text-center font-display text-xl font-semibold focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="rounded-full p-1 hover:bg-cream"
          aria-label="Increase"
        >
          <span className="block text-sm font-bold">+</span>
        </button>
      </div>
    </label>
  );
}
