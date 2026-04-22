"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/types";
import Toaster from "@/components/ui/Toaster";
import CartDrawer from "@/components/cart/CartDrawer";
import RegisterSW from "@/components/app-shell/RegisterSW";
import BackToTop from "@/components/ui/BackToTop";
import CompareBar from "@/components/product/CompareBar";
import WhatsAppFab from "@/components/ui/WhatsAppFab";

const SearchPalette = dynamic(() => import("@/components/search/SearchPalette"), {
  ssr: false,
});
const SocialProof = dynamic(() => import("@/components/ui/SocialProof"), {
  ssr: false,
});
const ExitIntent = dynamic(() => import("@/components/ui/ExitIntent"), {
  ssr: false,
});
const CompareDrawer = dynamic(() => import("@/components/product/CompareDrawer"), {
  ssr: false,
});
const ScratchCoupon = dynamic(() => import("@/components/ui/ScratchCoupon"), {
  ssr: false,
});

export default function ClientShell({ products }: { products: Product[] }) {
  return (
    <>
      <Toaster />
      <CartDrawer />
      <SearchPalette products={products} />
      <RegisterSW />
      <BackToTop />
      <SocialProof />
      <ExitIntent />
      <CompareBar />
      <CompareDrawer allProducts={products} />
      <WhatsAppFab />
      <ScratchCoupon />
    </>
  );
}
