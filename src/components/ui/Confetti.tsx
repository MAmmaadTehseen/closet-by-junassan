"use client";

import { useEffect, useRef } from "react";

type Props = {
  active: boolean;
  duration?: number;
  particleCount?: number;
};

const COLORS = ["#0a0a0a", "#c1121f", "#f1ede4", "#e8e2d5", "#6b6357"];

/**
 * Lightweight canvas confetti — no dependencies. Bursts once when
 * `active` flips true, auto-cleans after `duration`.
 */
export default function Confetti({
  active,
  duration = 1600,
  particleCount = 90,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string; rot: number; vr: number };
    const particles: P[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.offsetWidth / 2,
        y: canvas.offsetHeight / 3,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 8 - 3,
        r: Math.random() * 4 + 2,
        c: COLORS[i % COLORS.length],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25,
      });
    }

    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = now - t0;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const p of particles) {
        p.vy += 0.22;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8);
        ctx.restore();
      }
      if (t < duration) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, duration, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
}
