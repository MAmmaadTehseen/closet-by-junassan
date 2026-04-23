"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 4;

interface CompareState {
  ids: string[];
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

/**
 * Side-by-side product compare list — capped at 4 items so the UI fits
 * comfortably on a tablet without horizontal scroll.
 */
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
        if (get().ids.length >= MAX_COMPARE) return false;
        set((s) => ({ ids: [...s.ids, id] }));
        return true;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
    }),
    { name: "closet-compare" },
  ),
);

export const COMPARE_LIMIT = MAX_COMPARE;
