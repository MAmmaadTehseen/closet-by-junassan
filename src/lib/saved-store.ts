"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

export interface SavedItem extends CartItem {
  savedAt: string;
}

interface SavedState {
  items: SavedItem[];
  save: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      items: [],
      save: (item) =>
        set((s) => {
          if (s.items.some((i) => i.id === item.id)) return s;
          return {
            items: [
              ...s.items,
              { ...item, quantity: 1, savedAt: new Date().toISOString() },
            ],
          };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      has: (id) => get().items.some((i) => i.id === id),
    }),
    { name: "closet-saved-for-later" },
  ),
);
