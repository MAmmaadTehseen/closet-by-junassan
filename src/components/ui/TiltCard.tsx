"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number;
};

/**
 * Dribbble / Apple-style 3D mouse-tilt wrapper. Writes --mx and --my
 * (both in -1..1) as CSS vars so `.tilt-card` in globals.css can map
 * them to `rotateX` / `rotateY`.
 */
export default function TiltCard({ children, className = "", max = 1 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", String(Math.max(-max, Math.min(max, x))));
        el.style.setProperty("--my", String(Math.max(-max, Math.min(max, y))));
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}
