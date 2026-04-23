"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Interpolated wheel/touch scroll. Native `html { scroll-behavior: smooth }`
// remains as the fallback path for reduced-motion users and anchor jumps when
// Lenis isn't active, so no CSS changes are needed here.
export default function LenisProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (x: number) => 1 - Math.pow(1 - x, 3),
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
