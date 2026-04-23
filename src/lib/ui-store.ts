"use client";

import { create } from "zustand";

interface UiState {
  cartOpen: boolean;
  searchOpen: boolean;
  filtersOpen: boolean;
  lastAddedId: string | null;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openFilters: () => void;
  closeFilters: () => void;
  flashCartItem: (id: string) => void;
}

let flashClearTimer: ReturnType<typeof setTimeout> | null = null;

export const useUi = create<UiState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  filtersOpen: false,
  lastAddedId: null,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  openFilters: () => set({ filtersOpen: true }),
  closeFilters: () => set({ filtersOpen: false }),
  flashCartItem: (id) => {
    if (typeof window === "undefined") return;
    if (flashClearTimer !== null) clearTimeout(flashClearTimer);
    // Clear first so re-adding the same item retriggers the CSS animation.
    set({ lastAddedId: null });
    setTimeout(() => {
      set({ lastAddedId: id });
      flashClearTimer = setTimeout(() => {
        set({ lastAddedId: null });
        flashClearTimer = null;
      }, 800);
    }, 16);
  },
}));
