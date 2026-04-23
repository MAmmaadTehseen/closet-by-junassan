"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/types";
import Toaster from "@/components/ui/Toaster";
import CartDrawer from "@/components/cart/CartDrawer";
import RegisterSW from "@/components/app-shell/RegisterSW";
import BackToTop from "@/components/ui/BackToTop";
import IdleMount from "@/components/app-shell/IdleMount";
import LenisProvider from "@/components/app-shell/LenisProvider";

const SearchPalette = dynamic(() => import("@/components/search/SearchPalette"), {
  ssr: false,
});
const SocialProof = dynamic(() => import("@/components/ui/SocialProof"), {
  ssr: false,
});
const ExitIntent = dynamic(() => import("@/components/ui/ExitIntent"), {
  ssr: false,
});
const CursorCompanion = dynamic(() => import("@/components/ui/CursorCompanion"), {
  ssr: false,
});
const InstallPrompt = dynamic(() => import("@/components/ui/InstallPrompt"), {
  ssr: false,
});

export default function ClientShell({ products }: { products: Product[] }) {
  return (
    <>
      <LenisProvider />
      <Toaster />
      <CartDrawer />
      <SearchPalette products={products} />
      <RegisterSW />
      <BackToTop />
      <IdleMount>
        <SocialProof />
        <ExitIntent />
        <CursorCompanion />
      </IdleMount>
      <InstallPrompt />
    </>
  );
}
