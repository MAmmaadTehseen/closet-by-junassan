"use client";

import { Gift } from "lucide-react";
import { formatPKR } from "@/lib/format";

export const GIFT_WRAP_FEE_PKR = 200;
export const GIFT_MESSAGE_MAX = 140;

export interface GiftState {
  wrap: boolean;
  message: string;
}

export default function GiftOptions({
  value,
  onChange,
}: {
  value: GiftState;
  onChange: (next: GiftState) => void;
}) {
  const { wrap, message } = value;
  return (
    <div className="rounded-2xl border border-border bg-paper p-5">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={wrap}
          onChange={(e) => onChange({ ...value, wrap: e.target.checked })}
          className="mt-1 h-4 w-4 accent-ink"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <p className="font-semibold">Add gift wrap</p>
            <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              +{formatPKR(GIFT_WRAP_FEE_PKR)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Kraft-paper wrap with twine ribbon, no prices on the packing slip.
          </p>
        </div>
      </label>

      {wrap && (
        <div className="mt-4 border-t border-border pt-4">
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Gift message (optional)
            </span>
            <textarea
              value={message}
              onChange={(e) =>
                onChange({ ...value, message: e.target.value.slice(0, GIFT_MESSAGE_MAX) })
              }
              rows={2}
              maxLength={GIFT_MESSAGE_MAX}
              placeholder="Happy birthday, Ayesha! ♡"
              className="mt-1 w-full rounded-xl border border-border bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none"
            />
            <span className="mt-1 block text-right text-[10px] text-muted-foreground">
              {message.length}/{GIFT_MESSAGE_MAX}
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
