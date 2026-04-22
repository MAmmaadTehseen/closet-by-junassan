"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Gift, X, Copy, Check } from "lucide-react";

const STORAGE = "closet-spin";
const TRIGGER_DELAY_MS = 25_000;

interface Prize {
  label: string;
  code: string;
  weight: number;
  color: string;
}

const PRIZES: Prize[] = [
  { label: "Rs 200 OFF",   code: "FLAT200",  weight: 22, color: "#0a0a0a" },
  { label: "10% OFF",      code: "NEW10",    weight: 22, color: "#c1121f" },
  { label: "Free shipping",code: "SHIPFREE", weight: 18, color: "#1c1917" },
  { label: "Try again",    code: "",         weight: 18, color: "#6b6357" },
  { label: "Rs 500 OFF",   code: "SPIN500",  weight: 12, color: "#0a0a0a" },
  { label: "Mystery gift", code: "GIFT",     weight: 8,  color: "#c1121f" },
];

function pickPrize(): { prize: Prize; index: number } {
  const total = PRIZES.reduce((n, p) => n + p.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < PRIZES.length; i++) {
    r -= PRIZES[i].weight;
    if (r <= 0) return { prize: PRIZES[i], index: i };
  }
  return { prize: PRIZES[0], index: 0 };
}

export default function SpinWheel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout")) return;
    if (localStorage.getItem(STORAGE)) return;
    const t = setTimeout(() => setOpen(true), TRIGGER_DELAY_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  const close = () => {
    localStorage.setItem(STORAGE, JSON.stringify({ at: Date.now() }));
    setOpen(false);
  };

  const spin = () => {
    if (spinning || result) return;
    setSpinning(true);
    const { prize, index } = pickPrize();
    const slice = 360 / PRIZES.length;
    const stop = 360 * 6 + (360 - index * slice - slice / 2);
    setAngle(stop);
    setTimeout(() => {
      setSpinning(false);
      setResult(prize);
      try {
        localStorage.setItem(STORAGE, JSON.stringify({ code: prize.code, at: Date.now() }));
      } catch {}
    }, 4200);
  };

  const onCopy = async () => {
    if (!result?.code) return;
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (!open) return null;
  const slice = 360 / PRIZES.length;

  return (
    <div className="fade-in fixed inset-0 z-[90] flex items-end justify-center bg-ink/60 p-4 sm:items-center">
      <div className="bar-rise relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-paper p-6 shadow-2xl">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-cream hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="text-center">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
            <Gift className="h-3 w-3" /> One spin per visitor
          </div>
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">
            Win something on the house
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Spin the wheel for an instant discount or gift.
          </p>
        </div>

        <div className="relative mx-auto mt-5 aspect-square w-64">
          <div
            className="absolute left-1/2 top-0 z-10 -translate-x-1/2"
            aria-hidden
          >
            <div className="h-0 w-0 border-x-8 border-t-[14px] border-x-transparent border-t-ink" />
          </div>
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full"
            style={{
              transform: `rotate(${angle}deg)`,
              transition: spinning ? "transform 4s cubic-bezier(0.18,0.7,0.16,1)" : "none",
            }}
          >
            {PRIZES.map((p, i) => {
              const start = (i * slice * Math.PI) / 180;
              const end = ((i + 1) * slice * Math.PI) / 180;
              const x1 = 100 + 100 * Math.cos(start);
              const y1 = 100 + 100 * Math.sin(start);
              const x2 = 100 + 100 * Math.cos(end);
              const y2 = 100 + 100 * Math.sin(end);
              const labelAngle = i * slice + slice / 2;
              const lx = 100 + 60 * Math.cos((labelAngle * Math.PI) / 180);
              const ly = 100 + 60 * Math.sin((labelAngle * Math.PI) / 180);
              return (
                <g key={p.label}>
                  <path
                    d={`M100,100 L${x1},${y1} A100,100 0 0 1 ${x2},${y2} Z`}
                    fill={p.color}
                    stroke="#faf9f6"
                    strokeWidth="1"
                  />
                  <text
                    x={lx}
                    y={ly}
                    fill="#faf9f6"
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${labelAngle + 90} ${lx} ${ly})`}
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="14" fill="#faf9f6" stroke="#0a0a0a" strokeWidth="2" />
          </svg>
        </div>

        {result ? (
          <div className="mt-5 rounded-xl border border-border bg-cream/50 p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">You won</p>
            <p className="mt-1 font-display text-xl font-semibold">{result.label}</p>
            {result.code ? (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-paper px-3 py-1.5 text-xs">
                <code className="font-mono font-semibold tracking-wide">{result.code}</code>
                <button onClick={onCopy} aria-label="Copy code" className="text-muted-foreground hover:text-ink">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">Better luck next drop.</p>
            )}
          </div>
        ) : (
          <button
            onClick={spin}
            disabled={spinning}
            className="mt-5 w-full rounded-full bg-ink py-3 text-xs font-semibold uppercase tracking-[0.2em] text-paper transition hover:opacity-90 disabled:opacity-60"
          >
            {spinning ? "Spinning…" : "Spin the wheel"}
          </button>
        )}
        <p className="mt-3 text-center text-[10px] text-muted-foreground">
          Codes are case-insensitive. Apply at checkout.
        </p>
      </div>
    </div>
  );
}
