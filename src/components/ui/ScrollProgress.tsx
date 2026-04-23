"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        setP(total > 0 ? Math.min(1, Math.max(0, h.scrollTop / total)) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[2px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-ink transition-[transform] duration-150 ease-out"
        style={{ transform: `scaleX(${p})` }}
      />
    </div>
  );
}
