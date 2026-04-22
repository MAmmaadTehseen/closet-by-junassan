"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PriceAlert {
  productId: string;
  targetPrice: number;
  createdAt: number;
}

interface PriceAlertState {
  alerts: PriceAlert[];
  set: (productId: string, targetPrice: number) => void;
  remove: (productId: string) => void;
  get: (productId: string) => PriceAlert | undefined;
}

export const usePriceAlerts = create<PriceAlertState>()(
  persist(
    (set, get) => ({
      alerts: [],
      set: (productId, targetPrice) =>
        set((s) => {
          const rest = s.alerts.filter((a) => a.productId !== productId);
          return {
            alerts: [...rest, { productId, targetPrice, createdAt: Date.now() }],
          };
        }),
      remove: (productId) =>
        set((s) => ({ alerts: s.alerts.filter((a) => a.productId !== productId) })),
      get: (productId) => get().alerts.find((a) => a.productId === productId),
    }),
    { name: "closet-price-alerts" },
  ),
);
