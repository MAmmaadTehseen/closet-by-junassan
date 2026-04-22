"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import type { CartItem } from "@/lib/types";
import { toast } from "@/components/ui/Toaster";

export default function RecoverClient({ items }: { items: CartItem[] }) {
  const replace = useCart((s) => s.replace);
  const router = useRouter();

  useEffect(() => {
    if (Array.isArray(items) && items.length > 0) {
      replace(items);
      toast.success("Welcome back — your bag is ready.");
    }
    router.replace("/cart");
  }, [items, replace, router]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <p className="eyebrow">Restoring your bag…</p>
      <p className="mt-4 font-display text-2xl">One moment.</p>
    </div>
  );
}
