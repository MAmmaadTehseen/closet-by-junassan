"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
};

/**
 * Animated odometer-style counter. Starts once the element scrolls into
 * view, uses a cubic-easing tween on requestAnimationFrame.
 */
export default function CountUp({
  end,
  duration = 1800,
  prefix = "",
  suffix = "",
  separator = ",",
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            setStarted(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(end * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, end, duration]);

  const formatted = value.toLocaleString("en-US").replace(/,/g, separator);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
