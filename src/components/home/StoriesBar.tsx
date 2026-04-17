"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Drop } from "@/lib/drops";
import StoryViewer from "./StoryViewer";

const VIEWED_KEY = "closet-drops-viewed";

function readViewed(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(VIEWED_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export default function StoriesBar({ drops }: { drops: Drop[] }) {
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setViewed(readViewed());
    setMounted(true);
  }, []);

  if (drops.length === 0) return null;

  const onOpen = (i: number) => setOpenIdx(i);
  const onClose = () => {
    setViewed(readViewed());
    setOpenIdx(null);
  };

  return (
    <>
      <section className="border-b border-border bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="no-scrollbar flex gap-4 overflow-x-auto">
            {drops.map((d, i) => {
              const hasViewed = mounted && viewed.has(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => onOpen(i)}
                  className="group flex w-16 shrink-0 flex-col items-center gap-1.5 focus-ring"
                  aria-label={`View ${d.title}`}
                >
                  <span
                    className={`relative flex h-16 w-16 items-center justify-center rounded-full p-[2px] transition ${
                      hasViewed
                        ? "bg-border"
                        : "bg-linear-to-tr from-amber-500 via-accent-red to-ink"
                    }`}
                  >
                    <span className="relative flex h-full w-full overflow-hidden rounded-full border-2 border-paper bg-cream">
                      <Image
                        src={d.cover_image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover transition group-hover:scale-105"
                      />
                    </span>
                  </span>
                  <span className="line-clamp-1 w-full text-center text-[10px] font-medium text-ink">
                    {d.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {openIdx !== null && <StoryViewer drops={drops} startIndex={openIdx} onClose={onClose} />}
    </>
  );
}
