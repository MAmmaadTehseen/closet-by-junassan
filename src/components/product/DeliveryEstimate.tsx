"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

function parseDayRange(text: string): { min: number; max: number } {
  const nums = text.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 0) return { min: 3, max: 5 };
  if (nums.length === 1) return { min: nums[0], max: nums[0] };
  return { min: Math.min(nums[0], nums[1]), max: Math.max(nums[0], nums[1]) };
}

function addWorkingDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0) added += 1;
  }
  return d;
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("en-PK", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function DeliveryEstimate() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const { min, max } = parseDayRange(siteConfig.shipping.deliveryDays);
    const now = new Date();
    const lo = addWorkingDays(now, min);
    const hi = addWorkingDays(now, max);
    setLabel(`${formatShort(lo)} — ${formatShort(hi)}`);
  }, []);

  if (!label) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-cream/60 px-4 py-3">
      <Truck className="mt-0.5 h-4 w-4 shrink-0 text-ink/80" />
      <div className="text-xs leading-relaxed">
        <p className="font-semibold text-ink">Arrives {label}</p>
        <p className="text-muted-foreground">
          Order today · Cash on Delivery all over Pakistan
        </p>
      </div>
    </div>
  );
}
