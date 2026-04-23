"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

export default function GalleryLightbox({
  images,
  initial = 0,
  onClose,
}: {
  images: string[];
  initial?: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initial);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, images.length - 1));
      else if (e.key === "ArrowLeft") setIdx((i) => Math.max(i - 1, 0));
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 4));
      else if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setZoom(1);
    setPos({ x: 50, y: 50 });
  }, [idx]);

  const onWheel = (e: React.WheelEvent) => {
    const dz = e.deltaY > 0 ? -0.3 : 0.3;
    setZoom((z) => Math.min(4, Math.max(1, z + dz)));
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom === 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  if (images.length === 0) return null;

  return (
    <div className="fade-in fixed inset-0 z-[100] flex flex-col bg-black/95">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lg transition hover:scale-105 hover:bg-white/90 focus-ring sm:right-6 sm:top-6 sm:h-12 sm:w-12"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <div className="flex items-center justify-between px-4 py-3 pr-20 text-white sm:pr-24">
        <span className="text-xs font-semibold uppercase tracking-widest">
          {idx + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
            aria-label="Zoom out"
            className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30"
            disabled={zoom === 1}
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-10 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.5, 4))}
            aria-label="Zoom in"
            className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30"
            disabled={zoom === 4}
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 overflow-hidden"
        onWheel={onWheel}
        onMouseMove={onMove}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <Image
          src={images[idx]}
          alt=""
          fill
          sizes="100vw"
          priority
          className="select-none object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: `${pos.x}% ${pos.y}%`,
          }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() => setIdx((i) => Math.max(i - 1, 0))}
              disabled={idx === 0}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 disabled:opacity-20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIdx((i) => Math.min(i + 1, images.length - 1))}
              disabled={idx === images.length - 1}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 disabled:opacity-20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Image ${i + 1}`}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition ${
                i === idx ? "border-white" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={src} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
