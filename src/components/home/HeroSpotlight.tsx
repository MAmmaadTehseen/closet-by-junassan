"use client";

import { useEffect, useRef } from "react";

// A soft radial highlight that lerps toward the cursor. Writes --sx / --sy to
// a CSS variable on its own element; the gradient itself is declared in
// globals.css as `.hero-spotlight`. Bails out on reduced-motion and coarse
// pointers (falls back to a static centered gradient).
export default function HeroSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let tx = 50;
    let ty = 40;
    let cx = 50;
    let cy = 40;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width) * 100;
      ty = ((e.clientY - rect.top) / rect.height) * 100;
    };
    const onLeave = () => {
      tx = 50;
      ty = 40;
    };

    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.setProperty("--sx", `${cx.toFixed(2)}%`);
      el.style.setProperty("--sy", `${cy.toFixed(2)}%`);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden className="hero-spotlight" />;
}
