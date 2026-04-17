"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import GalleryLightbox from "./GalleryLightbox";

export default function Gallery({
  images,
  alt,
  transitionName,
}: {
  images: string[];
  alt: string;
  transitionName?: string;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [lens, setLens] = useState({ x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive((a) => Math.min(a + 1, images.length - 1));
      if (e.key === "ArrowLeft") setActive((a) => Math.max(a - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  if (images.length === 0) return null;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLens({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active ? "border-ink" : "border-transparent hover:border-ink/30"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1">
        <div
          data-gallery-hero
          className="relative aspect-4/5 w-full cursor-zoom-in overflow-hidden rounded-2xl bg-cream"
          onMouseMove={onMove}
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onClick={() => setZoomed((z) => !z)}
          role="img"
          aria-label={alt}
        >
          <Image
            src={images[active]}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className={`select-none object-cover transition-transform duration-500 ${
              zoomed ? "scale-[1.6]" : ""
            }`}
            style={{
              ...(zoomed ? { transformOrigin: `${lens.x}% ${lens.y}%` } : {}),
              ...(active === 0 && transitionName ? { viewTransitionName: transitionName } : {}),
            }}
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((a) => Math.max(a - 1, 0))}
              disabled={active === 0}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 p-2 shadow disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActive((a) => Math.min(a + 1, images.length - 1))}
              disabled={active === images.length - 1}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 p-2 shadow disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-6 bg-ink" : "w-1.5 bg-ink/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLightbox(true);
            setZoomed(false);
          }}
          aria-label="Open full-screen gallery"
          className="absolute right-3 top-3 rounded-full bg-paper/90 p-2 shadow transition hover:bg-paper"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {lightbox && (
        <GalleryLightbox images={images} initial={active} onClose={() => setLightbox(false)} />
      )}
    </div>
  );
}
