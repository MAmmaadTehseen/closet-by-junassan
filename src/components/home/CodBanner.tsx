import { Truck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function CodBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-foreground px-6 py-10 text-center text-background">
        <Truck className="h-6 w-6" />
        <h3 className="font-display text-2xl font-semibold sm:text-3xl">
          {siteConfig.shipping.banner}
        </h3>
        <p className="max-w-md text-sm text-background/70">
          Pay when your order arrives. Flat delivery across Pakistan.
        </p>
      </div>
    </section>
  );
}
