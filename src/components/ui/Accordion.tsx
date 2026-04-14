"use client";

import { useState, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

export default function Accordion({
  items,
  defaultOpen,
}: {
  items: { id: string; title: string; content: ReactNode }[];
  defaultOpen?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between py-4 text-left focus-ring"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold uppercase tracking-wide">
                {item.title}
              </span>
              {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
            {isOpen && (
              <div className="pb-5 pr-6 text-sm leading-relaxed text-muted-foreground fade-in">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
