"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PriceWatch {
  id: string;
  slug: string;
  name: string;
  capturedPrice: number;
  phone?: string;
  addedAt: string;
}

interface PriceDropState {
  watches: PriceWatch[];
  add: (w: Omit<PriceWatch, "addedAt">) => void;
  remove: (id: string) => void;
  setPhone: (phone: string) => void;
  has: (id: string) => boolean;
  phone: string;
}

export const usePriceDrop = create<PriceDropState>()(
  persist(
    (set, get) => ({
      watches: [],
      phone: "",
      add: (w) =>
        set((s) => {
          if (s.watches.some((x) => x.id === w.id)) return s;
          return {
            watches: [...s.watches, { ...w, addedAt: new Date().toISOString() }],
          };
        }),
      remove: (id) =>
        set((s) => ({ watches: s.watches.filter((w) => w.id !== id) })),
      setPhone: (phone) => set({ phone }),
      has: (id) => get().watches.some((w) => w.id === id),
    }),
    { name: "closet-price-drops" },
  ),
);
