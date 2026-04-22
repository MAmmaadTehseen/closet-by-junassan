"use client";

import { BellRing, Check } from "lucide-react";
import { usePriceDrop } from "@/lib/price-drop-store";
import { toast } from "@/components/ui/Toaster";
import type { Product } from "@/lib/types";

export default function PriceDropToggle({ product }: { product: Product }) {
  const has = usePriceDrop((s) => s.watches.some((w) => w.id === product.id));
  const add = usePriceDrop((s) => s.add);
  const remove = usePriceDrop((s) => s.remove);

  const onClick = () => {
    if (has) {
      remove(product.id);
      toast.info("Price alert removed");
      return;
    }
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      capturedPrice: product.price_pkr,
    });
    toast.success("We'll WhatsApp you if the price drops");
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={has}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition ${
        has
          ? "border-ink bg-ink text-paper"
          : "border-border text-ink hover:border-ink"
      }`}
    >
      {has ? <Check className="h-3 w-3" /> : <BellRing className="h-3 w-3" />}
      {has ? "Watching price" : "Notify me if it drops"}
    </button>
  );
}
