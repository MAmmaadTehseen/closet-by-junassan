"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const COMPARE_MAX = 4;

interface CompareState {
  ids: string[];
  toggle: (id: string) => { added: boolean; full: boolean };
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  isFull: () => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const current = get().ids;
        if (current.includes(id)) {
          set({ ids: current.filter((x) => x !== id) });
          return { added: false, full: false };
        }
        if (current.length >= COMPARE_MAX) {
          return { added: false, full: true };
        }
        set({ ids: [...current, id] });
        return { added: true, full: false };
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
      isFull: () => get().ids.length >= COMPARE_MAX,
    }),
    { name: "closet-compare" },
  ),
);
