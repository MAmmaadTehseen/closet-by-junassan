"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/types";
import Toaster from "@/components/ui/Toaster";
import CartDrawer from "@/components/cart/CartDrawer";
import RegisterSW from "@/components/app-shell/RegisterSW";

const SearchPalette = dynamic(() => import("@/components/search/SearchPalette"), {
  ssr: false,
});

export default function ClientShell({ products }: { products: Product[] }) {
  return (
    <>
      <Toaster />
      <CartDrawer />
      <SearchPalette products={products} />
      <RegisterSW />
    </>
  );
}
