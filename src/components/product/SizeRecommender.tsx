"use client";

import { useState } from "react";
import { Ruler, Sparkles } from "lucide-react";
import Modal from "@/components/ui/Modal";
import {
  recommendSize,
  type FitPreference,
  type RecommendedSize,
} from "@/lib/size-recommender";

export default function SizeRecommender({
  onPick,
}: {
  onPick?: (size: RecommendedSize) => void;
}) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [weight, setWeight] = useState("");
  const [fit, setFit] = useState<FitPreference>("regular");
  const [result, setResult] = useState<ReturnType<typeof recommendSize> | null>(null);

  const submit = () => {
    const input = {
      heightCm: Number(height) || 170,
      chestCm: Number(chest) || 0,
      waistCm: Number(waist) || 0,
      weightKg: Number(weight) || 0,
      fit,
    };
    setResult(recommendSize(input));
  };

  const reset = () => {
    setHeight("");
    setChest("");
    setWaist("");
    setWeight("");
    setFit("regular");
    setResult(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-ink"
      >
        <Ruler className="h-3.5 w-3.5" />
        Find my size
      </button>

      <Modal open={open} onClose={() => setOpen(false)} maxWidth="max-w-md">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="font-display text-xl font-semibold">Find my size</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us your measurements and we'll recommend the best fit for you.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <NumField label="Height (cm)" value={height} onChange={setHeight} placeholder="170" />
            <NumField label="Weight (kg)" value={weight} onChange={setWeight} placeholder="65" />
            <NumField label="Chest (cm)" value={chest} onChange={setChest} placeholder="96" />
            <NumField label="Waist (cm)" value={waist} onChange={setWaist} placeholder="80" />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Fit preference
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["slim", "regular", "relaxed"] as FitPreference[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFit(f)}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold capitalize transition ${
                    fit === f
                      ? "border-ink bg-ink text-paper"
                      : "border-border hover:bg-cream"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div className="mt-5 rounded-xl border border-border bg-cream/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recommended size · {result.confidence} confidence
              </p>
              <p className="mt-2 font-display text-4xl font-semibold">{result.size}</p>
              <p className="mt-2 text-xs text-muted-foreground">{result.reason}</p>
              {onPick && (
                <button
                  type="button"
                  onClick={() => {
                    onPick(result.size);
                    setOpen(false);
                  }}
                  className="mt-3 w-full rounded-full bg-ink py-2.5 text-[11px] font-semibold uppercase tracking-wider text-paper"
                >
                  Use size {result.size}
                </button>
              )}
            </div>
          )}

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={submit}
              className="flex-1 rounded-full bg-ink py-3 text-[11px] font-semibold uppercase tracking-wider text-paper hover:opacity-90"
            >
              Recommend size
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:bg-cream"
            >
              Reset
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function NumField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm focus-ring"
      />
    </label>
  );
}
