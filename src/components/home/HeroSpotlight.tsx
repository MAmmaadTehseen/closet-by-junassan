"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// Editorial three-orb spotlight. A sand wash sits at the back; an ink blob
// and an accent-red blob layer over it, each drifting along its own slow
// Lissajous path so the composition never loops visibly. On pointer: fine
// devices the cursor position is lerped into a shared offset that each orb
// applies proportional to its depth — the cursor behaves like a lens, not
// a force. Touch devices get the autonomous drift only. Reduced-motion
// users see the orbs frozen at t=0.

type OrbConfig = {
  color: string;
  blend: "normal" | "multiply";
  opacity: number;
  size: string;
  blur: number;
  ampX: number;
  ampY: number;
  freqX: number;
  freqY: number;
  phase: number;
  depth: number;
};

const ORBS: OrbConfig[] = [
  {
    color: "var(--sand)",
    blend: "normal",
    opacity: 0.6,
    size: "min(75vw, 65vh)",
    blur: 110,
    ampX: 14,
    ampY: 10,
    freqX: (2 * Math.PI) / 72,
    freqY: (2 * Math.PI) / 88,
    phase: 0,
    depth: 0.08,
  },
  {
    color: "var(--ink)",
    blend: "multiply",
    opacity: 0.18,
    size: "min(55vw, 55vh)",
    blur: 90,
    ampX: 20,
    ampY: 14,
    freqX: (2 * Math.PI) / 46,
    freqY: (2 * Math.PI) / 61,
    phase: Math.PI / 3,
    depth: 0.55,
  },
  {
    color: "var(--accent-red)",
    blend: "multiply",
    opacity: 0.22,
    size: "min(48vw, 50vh)",
    blur: 80,
    ampX: 18,
    ampY: 15,
    freqX: (2 * Math.PI) / 57,
    freqY: (2 * Math.PI) / 43,
    phase: Math.PI,
    depth: 0.35,
  },
];

function basePos(o: OrbConfig, t: number) {
  return {
    x: o.ampX * Math.sin(t * o.freqX + o.phase),
    y: o.ampY * Math.cos(t * o.freqY + o.phase),
  };
}

export default function HeroSpotlight() {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (shouldReduce) return;
    if (typeof window === "undefined") return;

    const cursorEnabled = window.matchMedia("(pointer: fine)").matches;
    const target = { x: 50, y: 50, active: false };
    const lerp = { x: 50, y: 50 };

    const onMove = (e: PointerEvent) => {
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        target.active = false;
        return;
      }
      target.x = ((e.clientX - rect.left) / rect.width) * 100;
      target.y = ((e.clientY - rect.top) / rect.height) * 100;
      target.active = true;
    };
    const onLeave = () => {
      target.active = false;
    };

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const tx = target.active ? target.x : 50;
      const ty = target.active ? target.y : 50;
      lerp.x += (tx - lerp.x) * 0.06;
      lerp.y += (ty - lerp.y) * 0.06;
      const dx = lerp.x - 50;
      const dy = lerp.y - 50;

      for (let i = 0; i < ORBS.length; i++) {
        const o = ORBS[i];
        const el = orbRefs.current[i];
        if (!el) continue;
        const b = basePos(o, t);
        const fx = b.x + dx * o.depth;
        const fy = b.y + dy * o.depth;
        el.style.transform = `translate3d(${fx}%, ${fy}%, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    if (cursorEnabled) {
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (cursorEnabled) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [shouldReduce]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {ORBS.map((o, i) => {
        const b = basePos(o, 0);
        return (
          <div
            key={i}
            ref={(el) => {
              orbRefs.current[i] = el;
            }}
            className="absolute inset-0"
            style={{
              willChange: "transform",
              transform: `translate3d(${b.x}%, ${b.y}%, 0)`,
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: o.size,
                height: o.size,
                background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
                filter: `blur(${o.blur}px)`,
                opacity: o.opacity,
                mixBlendMode: o.blend,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
