"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 4;

interface CompareState {
  ids: string[];
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const COMPARE_LIMIT = MAX;

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const cur = get().ids;
        if (cur.includes(id)) {
          set({ ids: cur.filter((x) => x !== id) });
          return false;
        }
        if (cur.length >= MAX) return false;
        set({ ids: [...cur, id] });
        return true;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "closet-compare" },
  ),
);
