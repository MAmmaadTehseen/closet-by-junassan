"use client";

import { useEffect, useRef } from "react";

/**
 * Horizontal kinetic marquee that nudges faster with scroll velocity.
 * Direction reverses on `dir="right"`. Inspired by Studio Freight /
 * Japanese fashion editorial headers.
 */
export default function KineticText({
  text,
  dir = "left",
  className = "",
  repeat = 6,
  baseDuration = 40,
}: {
  text: string;
  dir?: "left" | "right";
  className?: string;
  repeat?: number;
  baseDuration?: number;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let lastY = window.scrollY;
    let speed = 1;
    let raf = 0;

    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      speed = Math.min(3, Math.max(0.4, 1 + Math.abs(dy) / 18));
      el.style.animationDuration = `${baseDuration / speed}s`;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.animationDuration = `${baseDuration}s`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [baseDuration]);

  return (
    <div
      className={`marquee relative ${className}`}
      aria-label={text}
      style={{ ["--dir" as string]: dir === "right" ? "reverse" : "normal" }}
    >
      <div
        ref={trackRef}
        className="marquee__track"
        style={{
          animationDuration: `${baseDuration}s`,
          animationDirection: dir === "right" ? "reverse" : "normal",
        }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <span key={i} aria-hidden className="flex items-center gap-10 pr-10">
            <span>{text}</span>
            <span className="inline-block h-2 w-2 rounded-full bg-current opacity-60" />
          </span>
        ))}
      </div>
    </div>
  );
}
