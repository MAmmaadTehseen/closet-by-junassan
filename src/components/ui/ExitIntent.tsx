"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { waLink } from "@/lib/site-config";

const KEY = "closet-exit-intent";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export default function ExitIntent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ts = Number(localStorage.getItem(KEY) ?? 0);
    if (Date.now() - ts < COOLDOWN_MS) return;

    let triggered = false;
    const onLeave = (e: MouseEvent) => {
      if (triggered) return;
      if (e.clientY < 8 && e.relatedTarget === null) {
        triggered = true;
        setOpen(true);
      }
    };
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => document.documentElement.removeEventListener("mouseleave", onLeave);
  }, [pathname]);

  const close = () => {
    localStorage.setItem(KEY, String(Date.now()));
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fade-in fixed inset-0 z-[90] flex items-center justify-center bg-ink/60 px-4"
      onClick={close}
    >
      <div
        className="animate-fade-up w-full max-w-md overflow-hidden rounded-3xl border border-border bg-paper p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="float-right rounded-full p-1.5 text-muted-foreground hover:bg-cream hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper">
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="eyebrow">Wait a second</p>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-tight">
          Before you go — <span className="italic">10% off</span> your first order.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          DM us on WhatsApp with code <span className="font-semibold text-ink">FIRST10</span> and we&apos;ll
          set it up on your next checkout.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <a
            href={waLink("Hi! I'd like to use the FIRST10 discount code for my first order.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-ink px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-paper"
          >
            Claim on WhatsApp
          </a>
          <button
            onClick={close}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-ink hover:text-ink"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
