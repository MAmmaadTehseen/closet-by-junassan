"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A tiny label that follows the cursor over zones tagged with `data-cursor="…"`.
 * Desktop only. Respects reduced motion.
 */
export default function CursorCompanion() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    let frame = 0;
    let lastLabel: string | null = null;

    const onMove = (e: MouseEvent) => {
      const el = dotRef.current;
      if (!el) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });

      const target = e.target as HTMLElement | null;
      const zone = target?.closest?.("[data-cursor]") as HTMLElement | null;
      const next = zone?.getAttribute("data-cursor") ?? null;
      if (next !== lastLabel) {
        lastLabel = next;
        setLabel(next);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] -translate-x-1/2 -translate-y-1/2"
      style={{ willChange: "transform" }}
    >
      <div
        className={`flex min-h-14 min-w-14 items-center justify-center rounded-full bg-ink px-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper shadow-xl transition-all duration-200 ease-out ${
          label ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
