"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback: select the text
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group inline-flex items-center gap-2 rounded-full border border-border bg-cream/60 px-5 py-2 text-sm font-semibold tracking-widest transition hover:border-ink"
      aria-label="Copy order code"
    >
      <span className="font-mono">{code}</span>
      <span className="text-muted-foreground transition group-hover:text-ink">
        {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
