"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Drop } from "@/lib/drops";

const STORY_DURATION_MS = 5000;
const VIEWED_KEY = "closet-drops-viewed";

function getViewed(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(VIEWED_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export function markDropViewed(id: string) {
  const set = getViewed();
  set.add(id);
  localStorage.setItem(VIEWED_KEY, JSON.stringify(Array.from(set)));
}

export default function StoryViewer({
  drops,
  startIndex,
  onClose,
}: {
  drops: Drop[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const elapsed = useRef<number>(0);
  const raf = useRef<number>(0);

  const current = drops[idx];

  const advance = useCallback(() => {
    if (idx >= drops.length - 1) {
      onClose();
    } else {
      setIdx((i) => i + 1);
    }
  }, [idx, drops.length, onClose]);

  useEffect(() => {
    if (!current) return;
    markDropViewed(current.id);
    setProgress(0);
    elapsed.current = 0;
    startedAt.current = Date.now();

    const tick = () => {
      if (!paused) {
        const now = Date.now();
        elapsed.current += now - startedAt.current;
        startedAt.current = now;
        const p = Math.min(1, elapsed.current / STORY_DURATION_MS);
        setProgress(p);
        if (p >= 1) {
          advance();
          return;
        }
      } else {
        startedAt.current = Date.now();
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [idx, current, paused, advance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") advance();
      else if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [advance, onClose]);

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black">
      <div className="relative mx-auto flex h-full max-w-md flex-col">
        {/* Progress bars */}
        <div className="flex gap-1 p-3">
          {drops.map((_, i) => (
            <div key={i} className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white transition-[width]"
                style={{
                  width: i < idx ? "100%" : i === idx ? `${progress * 100}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close stories"
          className="absolute right-3 top-7 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Image */}
        <div
          className="relative flex-1"
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerCancel={() => setPaused(false)}
        >
          <Image
            src={current.cover_image}
            alt={current.title}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            priority
            className="object-cover"
          />
          {/* Tap zones for prev/next */}
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            aria-label="Previous story"
            className="absolute inset-y-0 left-0 w-1/3"
          />
          <button
            onClick={advance}
            aria-label="Next story"
            className="absolute inset-y-0 right-0 w-1/3"
          />

          {/* Gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/80 to-transparent" />

          {/* Copy */}
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="eyebrow !text-white/80">Weekly Drop</p>
            <h3 className="mt-2 font-display text-3xl font-semibold leading-tight">{current.title}</h3>
            {current.subtitle && (
              <p className="mt-2 max-w-xs text-sm text-white/85">{current.subtitle}</p>
            )}
            {current.cta_href && (
              <Link
                href={current.cta_href}
                onClick={onClose}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-black"
              >
                {current.cta_label ?? "Shop the Drop"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
