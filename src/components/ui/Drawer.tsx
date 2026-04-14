"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export default function Drawer({
  open,
  onClose,
  title,
  side = "right",
  width = "sm:w-[440px]",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "right" | "left";
  width?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-ink/50 fade-in"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`drawer-in absolute top-0 h-full w-full bg-paper shadow-2xl ${width} ${
          side === "right" ? "right-0" : "left-0"
        }`}
        style={side === "left" ? { animationName: "drawer-in-left" } : undefined}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 hover:bg-cream focus-ring"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[calc(100%-65px)] overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}
