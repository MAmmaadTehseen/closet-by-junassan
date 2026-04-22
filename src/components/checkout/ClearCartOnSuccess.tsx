"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";
import { useCoins, COINS_PER_PKR } from "@/lib/coins-store";

const AWARD_KEY = "closet-coin-pending-order";

export default function ClearCartOnSuccess() {
  const clear = useCart((s) => s.clear);
  const items = useCart((s) => s.items);
  const earn = useCoins((s) => s.earn);

  useEffect(() => {
    const subtotal = items.reduce((n, i) => n + i.price_pkr * i.quantity, 0);
    const guard = typeof window !== "undefined" ? sessionStorage.getItem(AWARD_KEY) : null;
    if (subtotal > 0 && !guard) {
      sessionStorage.setItem(AWARD_KEY, "1");
      earn(Math.round(subtotal * COINS_PER_PKR), "Order placed — thanks!");
    }
    if (items.length > 0) clear();
    return () => {
      // Allow next order on this device to award again after a reload.
      if (typeof window !== "undefined") {
        setTimeout(() => sessionStorage.removeItem(AWARD_KEY), 10_000);
      }
    };
  }, [clear, earn, items]);
  return null;
}
