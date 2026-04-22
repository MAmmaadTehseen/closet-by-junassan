"use client";

import { useEffect, useState } from "react";

/** Thin progress bar that tracks page-scroll position. Auto-hides at the very top. */
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let ticking = false;
    const calc = () => {
      const h = document.documentElement;
      const scroll = h.scrollTop || document.body.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      const value = height > 0 ? Math.min(100, Math.max(0, (scroll / height) * 100)) : 0;
      setPct(value);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calc);
        ticking = true;
      }
    };
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-0.5 bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-ink transition-[transform] duration-150"
        style={{
          transform: `scaleX(${pct / 100})`,
          opacity: pct > 2 ? 1 : 0,
          transition: "transform 0.12s linear, opacity 0.25s ease",
        }}
      />
    </div>
  );
}
