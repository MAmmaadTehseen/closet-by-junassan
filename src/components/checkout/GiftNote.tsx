"use client";

import { Gift, X } from "lucide-react";
import { useState } from "react";

const MAX = 220;

export default function GiftNote({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(Boolean(value));

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-paper px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-ink transition hover:border-ink"
      >
        <Gift className="h-3.5 w-3.5" /> Add a gift note
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-ink bg-paper p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest">
          <Gift className="h-3.5 w-3.5" /> Gift note
        </span>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            onChange("");
          }}
          className="rounded-full p-1 text-muted-foreground hover:bg-cream hover:text-ink"
          aria-label="Remove gift note"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX))}
        placeholder="A short, handwritten-style note tucked into the package."
        className="w-full rounded-xl border border-border bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
      />
      <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>We&apos;ll print this on recycled card-stock.</span>
        <span>
          {value.length}/{MAX}
        </span>
      </div>
    </div>
  );
}
