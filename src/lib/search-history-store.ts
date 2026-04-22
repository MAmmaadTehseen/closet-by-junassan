"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 6;

interface SearchHistoryState {
  recent: string[];
  push: (q: string) => void;
  clear: () => void;
}

export const useSearchHistory = create<SearchHistoryState>()(
  persist(
    (set) => ({
      recent: [],
      push: (q) => {
        const trimmed = q.trim();
        if (!trimmed || trimmed.length < 2) return;
        set((s) => ({
          recent: [trimmed, ...s.recent.filter((x) => x.toLowerCase() !== trimmed.toLowerCase())].slice(
            0,
            MAX,
          ),
        }));
      },
      clear: () => set({ recent: [] }),
    }),
    { name: "closet-search-history" },
  ),
);

export const TRENDING_SEARCHES = [
  "Denim jacket",
  "Linen shirt",
  "Silk dress",
  "Nike",
  "Adidas",
  "Ralph Lauren",
  "Under 2000",
  "Kids",
];
