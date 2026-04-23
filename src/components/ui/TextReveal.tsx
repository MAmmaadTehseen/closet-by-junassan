"use client";

import { useEffect, useRef, type ElementType } from "react";

/**
 * Letter-by-letter reveal (Linear / Bolt editorial). Splits text into
 * characters, fades each up with a stagger when the element enters the
 * viewport.
 */
export default function TextReveal({
  text,
  as: Tag = "span",
  className = "",
  stagger = 0.025,
  duration = 0.55,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const letters = Array.from(text);
  return (
    <Tag ref={ref as never} className={`text-reveal ${className}`}>
      {letters.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            transitionDelay: `${i * stagger}s`,
            transitionDuration: `${duration}s`,
            whiteSpace: ch === " " ? "pre" : undefined,
          }}
        >
          {ch}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
