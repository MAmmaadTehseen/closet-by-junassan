"use client";

import { useSyncExternalStore } from "react";
import { Truck, Clock } from "lucide-react";
import { expectedArrivalBy, formatTimeToCutoff } from "@/lib/delivery";

function subscribeTick(callback: () => void) {
  const id = window.setInterval(callback, 30_000);
  return () => window.clearInterval(id);
}

const getServerSnapshot = () => 0;

export default function DeliveryCountdown() {
  // Subscribes to a 30s tick; returns Date.now() so the component re-renders on tick.
  const now = useSyncExternalStore(
    subscribeTick,
    () => Date.now(),
    getServerSnapshot,
  );

  if (now === 0) {
    // Server snapshot — render nothing to avoid mismatches on hydration.
    return null;
  }

  const nowDate = new Date(now);
  const { label, hours } = formatTimeToCutoff(nowDate);
  const arrive = expectedArrivalBy(nowDate);
  const urgent = hours < 3;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-cream/50 px-4 py-3 text-xs">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper">
        <Truck className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">
          Order in the next{" "}
          <span className={urgent ? "text-accent-red" : "text-ink"}>
            <Clock className="mr-0.5 inline h-3 w-3 align-[-0.1em]" />
            {label}
          </span>{" "}
          for arrival by{" "}
          <span className="font-semibold">{arrive}</span>
        </p>
        <p className="mt-0.5 text-muted-foreground">
          We dispatch daily before 5 PM, then the clock resets.
        </p>
      </div>
    </div>
  );
}
