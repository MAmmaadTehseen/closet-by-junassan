"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/types";
import Toaster from "@/components/ui/Toaster";
import CartDrawer from "@/components/cart/CartDrawer";
import RegisterSW from "@/components/app-shell/RegisterSW";
import BackToTop from "@/components/ui/BackToTop";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CompareDrawer from "@/components/compare/CompareDrawer";
import CompareBar from "@/components/compare/CompareBar";

const SearchPalette = dynamic(() => import("@/components/search/SearchPalette"), {
  ssr: false,
});
const SocialProof = dynamic(() => import("@/components/ui/SocialProof"), {
  ssr: false,
});
const ExitIntent = dynamic(() => import("@/components/ui/ExitIntent"), {
  ssr: false,
});
const WhatsAppBubble = dynamic(() => import("@/components/ui/WhatsAppBubble"), {
  ssr: false,
});
const KeyboardShortcuts = dynamic(() => import("@/components/ui/KeyboardShortcuts"), {
  ssr: false,
});

export default function ClientShell({ products }: { products: Product[] }) {
  return (
    <>
      <ScrollProgress />
      <Toaster />
      <CartDrawer />
      <CompareDrawer products={products} />
      <CompareBar />
      <SearchPalette products={products} />
      <RegisterSW />
      <BackToTop />
      <SocialProof />
      <ExitIntent />
      <WhatsAppBubble />
      <KeyboardShortcuts />
    </>
  );
}
