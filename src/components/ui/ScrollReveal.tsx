"use client";

import type { ElementType } from "react";
import { useReveal } from "@/lib/hooks/use-reveal";

/**
 * Splits children text into word spans that fade up as they scroll into view.
 * Uses native CSS `animation-timeline: view()` with a 6% stagger; falls back to
 * an IntersectionObserver reveal for unsupported browsers.
 */
export default function ScrollReveal({
  text,
  as: Tag = "h2",
  className = "",
  stagger = 0.06,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
}) {
  const ref = useReveal<HTMLElement>();
  const words = text.split(/(\s+)/);

  return (
    <Tag ref={ref as never} className={`scroll-reveal ${className}`}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        return (
          <span
            key={i}
            style={{ animationDelay: `${i * stagger}s`, transitionDelay: `${i * stagger}s` }}
          >
            {w}
          </span>
        );
      })}
    </Tag>
  );
}
