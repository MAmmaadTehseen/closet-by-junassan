"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/types";
import Toaster from "@/components/ui/Toaster";
import CartDrawer from "@/components/cart/CartDrawer";
import RegisterSW from "@/components/app-shell/RegisterSW";
import BackToTop from "@/components/ui/BackToTop";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import MobileTabBar from "@/components/layout/MobileTabBar";

const SearchPalette = dynamic(() => import("@/components/search/SearchPalette"), {
  ssr: false,
});
const SocialProof = dynamic(() => import("@/components/ui/SocialProof"), {
  ssr: false,
});
const ExitIntent = dynamic(() => import("@/components/ui/ExitIntent"), {
  ssr: false,
});
const CookieConsent = dynamic(() => import("@/components/ui/CookieConsent"), {
  ssr: false,
});
const WhatsAppFAB = dynamic(() => import("@/components/ui/WhatsAppFAB"), {
  ssr: false,
});
const CompareBar = dynamic(() => import("@/components/product/CompareBar"), {
  ssr: false,
});

export default function ClientShell({ products }: { products: Product[] }) {
  return (
    <>
      <ScrollProgressBar />
      <Toaster />
      <CartDrawer products={products} />
      <SearchPalette products={products} />
      <RegisterSW />
      <BackToTop />
      <SocialProof />
      <ExitIntent />
      <CookieConsent />
      <WhatsAppFAB />
      <CompareBar products={products} />
      <MobileTabBar />
    </>
  );
}
