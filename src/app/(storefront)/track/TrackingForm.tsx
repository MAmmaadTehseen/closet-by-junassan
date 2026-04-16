"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function TrackingForm({ defaultCode = "" }: { defaultCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(defaultCode);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter your order code.");
      return;
    }
    if (!/^CBJ-[A-Z0-9]+$/.test(trimmed)) {
      setError("Order codes look like CBJ-XXXXXXXX. Check your confirmation message.");
      return;
    }
    setError("");
    router.push(`/track?code=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider">
          Order Code
        </span>
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(""); }}
          placeholder="CBJ-XXXXXXXX"
          autoFocus
          className={`w-full rounded-xl border bg-paper px-4 py-3 text-sm font-mono uppercase tracking-wider focus:outline-none ${
            error ? "border-accent-red focus:border-accent-red" : "border-border focus:border-ink"
          }`}
        />
        {error && <p className="mt-1.5 text-xs text-accent-red">{error}</p>}
      </label>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
      >
        <Search className="h-3.5 w-3.5" /> Track Order
      </button>
    </form>
  );
}
