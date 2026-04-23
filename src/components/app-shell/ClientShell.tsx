"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/types";
import Toaster from "@/components/ui/Toaster";
import CartDrawer from "@/components/cart/CartDrawer";
import RegisterSW from "@/components/app-shell/RegisterSW";
import BackToTop from "@/components/ui/BackToTop";
import ScrollProgress from "@/components/ui/ScrollProgress";

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
const FloatingWhatsApp = dynamic(() => import("@/components/ui/FloatingWhatsApp"), {
  ssr: false,
});

export default function ClientShell({ products }: { products: Product[] }) {
  return (
    <>
      <ScrollProgress />
      <Toaster />
      <CartDrawer />
      <SearchPalette products={products} />
      <RegisterSW />
      <BackToTop />
      <SocialProof />
      <ExitIntent />
      <CursorCompanion />
      <InstallPrompt />
      <FloatingWhatsApp />
    </>
  );
}
