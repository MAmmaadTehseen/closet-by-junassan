"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const COMPARE_MAX = 4;

interface CompareState {
  ids: string[];
  toggle: (id: string) => { added: boolean; full: boolean };
  add: (id: string) => { added: boolean; full: boolean };
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      add: (id) => {
        const cur = get().ids;
        if (cur.includes(id)) return { added: true, full: false };
        if (cur.length >= COMPARE_MAX) return { added: false, full: true };
        set({ ids: [...cur, id] });
        return { added: true, full: false };
      },
      toggle: (id) => {
        const cur = get().ids;
        if (cur.includes(id)) {
          set({ ids: cur.filter((x) => x !== id) });
          return { added: false, full: false };
        }
        if (cur.length >= COMPARE_MAX) return { added: false, full: true };
        set({ ids: [...cur, id] });
        return { added: true, full: false };
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "closet-compare" },
  ),
);
