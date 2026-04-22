"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 4;

interface CompareState {
  ids: string[];
  open: boolean;
  toggle: (id: string) => boolean;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const MAX_COMPARE_ITEMS = MAX_COMPARE;

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      open: false,
      toggle: (id) => {
        const has = get().ids.includes(id);
        if (has) {
          set({ ids: get().ids.filter((x) => x !== id) });
          return false;
        }
        if (get().ids.length >= MAX_COMPARE) return false;
        set({ ids: [...get().ids, id] });
        return true;
      },
      has: (id) => get().ids.includes(id),
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      clear: () => set({ ids: [] }),
      openDrawer: () => set({ open: true }),
      closeDrawer: () => set({ open: false }),
    }),
    {
      name: "closet-compare",
      partialize: (s) => ({ ids: s.ids }),
    },
  ),
);
