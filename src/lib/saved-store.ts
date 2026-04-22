"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

interface SavedState {
  items: CartItem[];
  save: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useSaved = create<SavedState>()(
  persist(
    (set) => ({
      items: [],
      save: (item) =>
        set((s) =>
          s.items.find((i) => i.id === item.id)
            ? s
            : { items: [item, ...s.items].slice(0, 30) },
        ),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "closet-saved-for-later" },
  ),
);
