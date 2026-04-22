"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 4;

interface CompareState {
  ids: string[];
  toggle: (id: string) => boolean;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  isFull: () => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        if (has) {
          set((s) => ({ ids: s.ids.filter((x) => x !== id) }));
          return false;
        }
        if (get().ids.length >= MAX) return false;
        set((s) => ({ ids: [...s.ids, id] }));
        return true;
      },
      has: (id) => get().ids.includes(id),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
      isFull: () => get().ids.length >= MAX,
    }),
    { name: "closet-compare" },
  ),
);

export const COMPARE_MAX = MAX;
