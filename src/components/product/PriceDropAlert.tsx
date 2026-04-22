"use client";

import { useEffect, useState } from "react";
import { BellRing, Check } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { waLink } from "@/lib/site-config";

const KEY_PREFIX = "closet-pricedrop-";

export default function PriceDropAlert({
  productId,
  productName,
  price,
}: {
  productId: string;
  productName: string;
  price: number;
}) {
  const key = `${KEY_PREFIX}${productId}`;
  const [done, setDone] = useState(false);
  const [target, setTarget] = useState<number>(Math.max(100, Math.round(price * 0.85)));

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(key)) setDone(true);
    } catch {}
  }, [key]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(key, String(target));
    } catch {}
    setDone(true);
    const wa = waLink(
      `Hi! Please notify me if "${productName}" drops to ${formatPKR(target)} or lower. (Current: ${formatPKR(price)})`,
    );
    window.open(wa, "_blank", "noopener,noreferrer");
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-cream/50 px-4 py-3 text-xs">
        <Check className="h-3.5 w-3.5 text-green-600" />
        <span>
          We&apos;ll ping you if <span className="font-semibold">{productName}</span> drops below{" "}
          <span className="font-semibold">{formatPKR(target)}</span>.
        </span>
      </div>
    );
  }

  const suggestions = [
    Math.round(price * 0.9),
    Math.round(price * 0.8),
    Math.round(price * 0.7),
  ];

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-paper p-4"
    >
      <div className="mb-2 flex items-center gap-2">
        <BellRing className="h-3.5 w-3.5 text-ink" />
        <span className="text-xs font-semibold">Alert me if the price drops</span>
      </div>
      <p className="mb-3 text-[11px] text-muted-foreground">
        Target price — we&apos;ll message you the moment it hits.
      </p>
      <div className="flex gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTarget(s)}
            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
              target === s
                ? "border-ink bg-ink text-paper"
                : "border-border hover:border-ink"
            }`}
          >
            {formatPKR(s)}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          min={100}
          max={price - 1}
          className="flex-1 rounded-xl border border-border bg-paper px-3 py-2 text-xs focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-paper hover:opacity-90"
        >
          Alert me
        </button>
      </div>
    </form>
  );
}
