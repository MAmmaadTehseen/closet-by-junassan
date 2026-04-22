"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const COMPARE_LIMIT = 3;

interface CompareState {
  ids: string[];
  open: boolean;
  toggle: (id: string) => { added: boolean; full: boolean };
  remove: (id: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  has: (id: string) => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      open: false,
      toggle: (id) => {
        const ids = get().ids;
        if (ids.includes(id)) {
          set({ ids: ids.filter((x) => x !== id) });
          return { added: false, full: false };
        }
        if (ids.length >= COMPARE_LIMIT) {
          return { added: false, full: true };
        }
        set({ ids: [...ids, id] });
        return { added: true, full: false };
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
      openDrawer: () => set({ open: true }),
      closeDrawer: () => set({ open: false }),
      has: (id) => get().ids.includes(id),
    }),
    {
      name: "closet-compare",
      partialize: (s) => ({ ids: s.ids }),
    },
  ),
);
