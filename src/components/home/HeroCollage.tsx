"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const COLLAGE = [
  "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
];

export default function HeroCollage() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        wrap.style.setProperty("--mx", nx.toString());
        wrap.style.setProperty("--my", ny.toString());
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      wrap.style.setProperty("--mx", "0");
      wrap.style.setProperty("--my", "0");
    };
    window.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={
        {
          "--mx": 0,
          "--my": 0,
          perspective: "900px",
        } as React.CSSProperties
      }
      className="relative mx-auto flex h-85 w-full max-w-130 items-center justify-center sm:h-115 lg:h-130"
    >
      <div
        style={{
          transform:
            "translate(calc(var(--mx) * 14px), calc(var(--my) * 10px)) rotate(-5deg)",
          transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
        className="absolute left-[8%] top-[4%] h-[56%] w-[48%] overflow-hidden rounded-2xl border border-border bg-cream shadow-2xl"
      >
        <Image
          src={COLLAGE[0]}
          alt=""
          fill
          sizes="(max-width: 1024px) 50vw, 240px"
          className="object-cover"
          priority
        />
      </div>
      <div
        style={{
          transform:
            "translate(calc(var(--mx) * -22px), calc(var(--my) * -12px)) rotate(4deg)",
          transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
        className="absolute right-[6%] top-[20%] h-[62%] w-[54%] overflow-hidden rounded-2xl border border-border bg-cream shadow-2xl"
      >
        <Image
          src={COLLAGE[1]}
          alt=""
          fill
          sizes="(max-width: 1024px) 55vw, 280px"
          className="object-cover"
          priority
        />
      </div>
      <div
        style={{
          transform:
            "translate(calc(var(--mx) * 8px), calc(var(--my) * -18px)) rotate(2deg)",
          transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
        className="absolute bottom-[2%] left-[18%] h-[42%] w-[42%] overflow-hidden rounded-2xl border border-border bg-cream shadow-xl"
      >
        <Image
          src={COLLAGE[2]}
          alt=""
          fill
          sizes="(max-width: 1024px) 40vw, 200px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
