"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
};

export default function MagneticButton({
  children,
  strength = 0.35,
  radius = 90,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const target = wrap.firstElementChild as HTMLElement | null;
    if (!target) return;
    targetRef.current = target;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    target.style.transition = "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)";
    target.style.willChange = "transform";

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        target.style.transform = "";
        return;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        target.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      target.style.transform = "";
    };

    window.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [radius, strength]);

  return (
    <span ref={wrapRef} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
