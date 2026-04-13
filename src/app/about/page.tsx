import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">
        About {siteConfig.name}
      </h1>
      <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
        <p>
          {siteConfig.name} is a curated fashion thrift store bringing you affordable
          branded finds. We offer limited stock items with a focus on style, value, and
          everyday fashion.
        </p>
        <p>
          Every piece is hand-picked, inspected, and priced for Pakistani shoppers who
          care about style without overspending. From denim and dresses to sneakers and
          totes — we bring you curated drops week after week.
        </p>
        <p>Cash on Delivery available all over Pakistan. Flat delivery nationwide.</p>
      </div>
    </div>
  );
}
