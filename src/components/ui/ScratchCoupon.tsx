"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, Gift, X, Copy, Check } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

const KEY = "closet-scratch-coupon-v1";
const TRIGGER_MS = 18_000; // 18 seconds on site

const REWARDS = [
  { code: "JUN500", label: "Rs 500 off orders over Rs 3000" },
  { code: "FIRST15", label: "15% off your first order" },
  { code: "CBJSHIP", label: "Free delivery on any order" },
  { code: "DROP10", label: "10% off any single piece" },
];

function pickReward(): (typeof REWARDS)[number] {
  return REWARDS[Math.floor(Math.random() * REWARDS.length)];
}

export default function ScratchCoupon() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [reward, setReward] = useState(REWARDS[0]);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return;
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {}
    const t = setTimeout(() => {
      setReward(pickReward());
      setOpen(true);
    }, TRIGGER_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!open || revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#cbbf95");
    gradient.addColorStop(1, "#8a7742");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ Scratch to reveal ✦", w / 2, h / 2);

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    };

    const checkScratched = () => {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] < 64) clear++;
      }
      const pct = clear / (pixels.length / 16);
      if (pct > 0.35) setRevealed(true);
    };

    const pos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: PointerEvent) => {
      drawing.current = true;
      const { x, y } = pos(e);
      scratch(x, y);
    };
    const onMove = (e: PointerEvent) => {
      if (!drawing.current) return;
      const { x, y } = pos(e);
      scratch(x, y);
    };
    const onUp = () => {
      drawing.current = false;
      checkScratched();
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onUp);
    };
  }, [open, revealed]);

  const close = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ code: reward.code, ts: Date.now() }));
    } catch {}
    setOpen(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reward.code);
      setCopied(true);
      toast.success("Code copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (!open) return null;

  return (
    <div
      className="fade-in fixed inset-0 z-[95] flex items-center justify-center bg-ink/60 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="animate-fade-up relative w-full max-w-sm overflow-hidden rounded-3xl bg-paper p-7 shadow-2xl">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-cream"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper">
          <Gift className="h-5 w-5" />
        </div>
        <p className="eyebrow mt-4 text-center">Surprise drop</p>
        <h3 className="mt-1 text-center font-display text-2xl font-semibold">
          You&apos;ve unlocked a coupon.
        </h3>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Scratch the card to reveal your code.
        </p>

        <div className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-cream">
          <div className="p-5 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Your code
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {reward.code}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{reward.label}</p>
          </div>
          {!revealed && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full cursor-grab touch-none"
            />
          )}
        </div>

        {revealed ? (
          <div className="mt-4 flex gap-2">
            <button
              onClick={copy}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3 text-[11px] font-semibold uppercase tracking-widest text-paper hover:opacity-90"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy code"}
            </button>
            <button
              onClick={close}
              className="inline-flex items-center justify-center rounded-full border border-border px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-ink hover:text-ink"
            >
              Later
            </button>
          </div>
        ) : (
          <p className="mt-4 inline-flex w-full items-center justify-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Drag across to scratch
          </p>
        )}
      </div>
    </div>
  );
}
