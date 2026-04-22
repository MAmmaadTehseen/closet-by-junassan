"use client";

import { useMemo, useState } from "react";
import { Ruler, Sparkles } from "lucide-react";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"] as const;
type Size = (typeof SIZE_ORDER)[number];

function classify(heightCm: number, weightKg: number, build: "lean" | "regular" | "broad"): {
  size: Size;
  confidence: "High" | "Medium" | "Low";
  note: string;
} {
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  let base: Size = "M";
  if (bmi < 18.5) base = "S";
  else if (bmi < 23) base = "M";
  else if (bmi < 27) base = "L";
  else if (bmi < 32) base = "XL";
  else base = "XXL";

  if (heightCm >= 185 && base === "M") base = "L";
  if (heightCm < 158 && base === "M") base = "S";

  const idx = SIZE_ORDER.indexOf(base);
  const shifted = build === "broad" ? Math.min(idx + 1, SIZE_ORDER.length - 1) : build === "lean" ? Math.max(idx - 1, 0) : idx;
  const size = SIZE_ORDER[shifted];

  const confidence = bmi > 17 && bmi < 30 && heightCm >= 150 && heightCm <= 195 ? "High" : "Medium";
  const note =
    build === "broad"
      ? "Bumped one size up for a roomier fit on broader frames."
      : build === "lean"
        ? "Nudged one size down for a slimmer silhouette."
        : "Standard fit — should feel true to size.";
  return { size, confidence, note };
}

export default function SizeRecommender({ listedSize }: { listedSize: string }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [build, setBuild] = useState<"lean" | "regular" | "broad">("regular");

  const rec = useMemo(() => classify(height, weight, build), [height, weight, build]);

  const sameAsListed = rec.size.toLowerCase() === listedSize.toLowerCase();

  return (
    <div className="rounded-2xl border border-border bg-paper p-4">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Ruler className="h-4 w-4" /> Find my size
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {open ? "Hide" : "Open"}
        </span>
      </button>

      {open && (
        <div className="mt-4 space-y-4 fade-in">
          <div>
            <label className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <span>Height</span>
              <span className="text-ink">{height} cm</span>
            </label>
            <input
              type="range"
              min={145}
              max={200}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-2 w-full accent-ink"
            />
          </div>
          <div>
            <label className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <span>Weight</span>
              <span className="text-ink">{weight} kg</span>
            </label>
            <input
              type="range"
              min={40}
              max={130}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-2 w-full accent-ink"
            />
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Build
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["lean", "regular", "broad"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBuild(b)}
                  className={`rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-widest capitalize transition ${
                    build === b
                      ? "border-ink bg-ink text-paper"
                      : "border-border bg-paper text-ink hover:border-ink"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-cream/60 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                We&apos;d pick{" "}
                <span className="text-ink font-semibold">size {rec.size}</span>{" "}
                <span className="text-[11px] text-muted-foreground">
                  · {rec.confidence} confidence
                </span>
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{rec.note}</p>
              {!sameAsListed && (
                <p className="mt-1 text-[11px] text-accent-red">
                  This piece is listed in size {listedSize.toUpperCase()} — check measurements to be sure.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
