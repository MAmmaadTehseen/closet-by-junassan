"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

export default function ClearCartOnSuccess() {
  const clear = useCart((s) => s.clear);
  const count = useCart((s) => s.items.length);
  useEffect(() => {
    if (count > 0) clear();
  }, [clear, count]);
  return null;
}
