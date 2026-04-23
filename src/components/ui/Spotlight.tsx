"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Cursor-following radial spotlight overlay. Adds a soft light that
 * tracks the pointer within the container — inspired by Vercel/Linear.
 */
export default function Spotlight({
  children,
  className = "",
  color = "rgba(241,237,228,0.55)",
  size = 420,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--sy", `${e.clientY - rect.top}px`);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={
        {
          "--spot-color": color,
          "--spot-size": `${size}px`,
        } as React.CSSProperties
      }
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(var(--spot-size) circle at var(--sx, 50%) var(--sy, 50%), var(--spot-color), transparent 65%)",
          mixBlendMode: "plus-lighter",
        }}
      />
    </div>
  );
}
