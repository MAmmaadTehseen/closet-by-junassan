"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const COMPARE_LIMIT = 4;

interface CompareState {
  ids: string[];
  toggle: (id: string) => void;
  add: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  isFull: () => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => {
          if (s.ids.includes(id)) return { ids: s.ids.filter((x) => x !== id) };
          if (s.ids.length >= COMPARE_LIMIT) return s;
          return { ids: [...s.ids, id] };
        }),
      add: (id) => {
        const s = get();
        if (s.ids.includes(id)) return true;
        if (s.ids.length >= COMPARE_LIMIT) return false;
        set({ ids: [...s.ids, id] });
        return true;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
      isFull: () => get().ids.length >= COMPARE_LIMIT,
    }),
    { name: "closet-compare" },
  ),
);
