"use client";

import { useEffect, useState } from "react";
import { BellRing, BellOff, Check } from "lucide-react";
import { usePriceAlerts } from "@/lib/price-alert-store";
import { formatPKR } from "@/lib/format";
import { toast } from "@/components/ui/Toaster";

export default function PriceAlertButton({
  productId,
  currentPrice,
}: {
  productId: string;
  currentPrice: number;
}) {
  const setAlert = usePriceAlerts((s) => s.set);
  const remove = usePriceAlerts((s) => s.remove);
  const alerts = usePriceAlerts((s) => s.alerts);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(() => Math.max(100, Math.round(currentPrice * 0.9)));

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const existing = mounted ? alerts.find((a) => a.productId === productId) : undefined;

  const onSave = () => {
    if (target >= currentPrice) {
      toast.error("Set an amount below the current price");
      return;
    }
    if (target < 100) {
      toast.error("Pick an amount at least Rs 100");
      return;
    }
    setAlert(productId, target);
    toast.success(`We'll ping you if it drops to ${formatPKR(target)}`);
    setOpen(false);
  };

  const onRemove = () => {
    remove(productId);
    toast.success("Price alert removed");
  };

  return (
    <div className="rounded-2xl border border-border bg-cream/40 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
          <BellRing className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Price drop alert</p>
          {existing ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              <Check className="-mt-0.5 mr-1 inline h-3 w-3" /> Alerting at{" "}
              {formatPKR(existing.targetPrice)} — we&apos;ll WhatsApp you if it drops.
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Not the right price? Get a ping the moment it drops.
            </p>
          )}
        </div>
        {existing ? (
          <button
            onClick={onRemove}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-paper px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink hover:border-ink"
          >
            <BellOff className="h-3 w-3" /> Stop
          </button>
        ) : (
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full border border-ink bg-paper px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper"
          >
            {open ? "Cancel" : "Notify me"}
          </button>
        )}
      </div>

      {!existing && open && (
        <div className="mt-3 fade-in">
          <label
            htmlFor="price-alert-range"
            className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
          >
            <span>Alert me at</span>
            <span className="text-ink">{formatPKR(target)}</span>
          </label>
          <input
            id="price-alert-range"
            type="range"
            min={100}
            max={Math.max(200, currentPrice - 50)}
            step={50}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="mt-2 w-full accent-ink"
          />
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Rs 100</span>
            <span>Current {formatPKR(currentPrice)}</span>
          </div>
          <button
            onClick={onSave}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-paper"
          >
            Save alert
          </button>
        </div>
      )}
    </div>
  );
}
