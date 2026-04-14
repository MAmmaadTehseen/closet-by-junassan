"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 8;

interface RecentState {
  slugs: string[];
  push: (slug: string) => void;
  clear: () => void;
}

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      slugs: [],
      push: (slug) =>
        set((s) => ({
          slugs: [slug, ...s.slugs.filter((x) => x !== slug)].slice(0, MAX),
        })),
      clear: () => set({ slugs: [] }),
    }),
    { name: "closet-recent" },
  ),
);
