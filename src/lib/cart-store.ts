"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  replace: (items: CartItem[]) => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            const nextQty = Math.min(existing.quantity + item.quantity, item.maxStock);
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: nextQty } : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, Math.min(qty, i.maxStock)) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
      replace: (items) => set({ items }),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price_pkr * i.quantity, 0),
    }),
    { name: "closet-cart" },
  ),
);
