"use client";

import { useEffect, useMemo, useState } from "react";
import { Share2, Copy, Check, MessageCircle, Eye } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import RestockNotify from "./RestockNotify";
import StickyBuyBar from "./StickyBuyBar";
import WishlistButton from "./WishlistButton";
import SizeGuideModal from "./SizeGuideModal";
import DeliveryCountdown from "./DeliveryCountdown";
import PriceDropToggle from "./PriceDropToggle";
import CompareToggle from "@/components/compare/CompareToggle";
import Accordion from "@/components/ui/Accordion";
import { useRecent } from "@/lib/recent-store";
import { toast } from "@/components/ui/Toaster";
import { formatPKR, seededRandom } from "@/lib/format";
import { pkrToUrduWords } from "@/lib/urdu-number";
import { waLink, siteConfig } from "@/lib/site-config";
import type { Product } from "@/lib/types";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.size);
  const [copied, setCopied] = useState(false);
  const push = useRecent((s) => s.push);

  useEffect(() => {
    push(product.slug);
  }, [product.slug, push]);

  // Faux but stable "watching now" count for urgency.
  const watching = useMemo(() => 3 + Math.floor(seededRandom(product.slug) * 9), [product.slug]);

  const discount =
    product.original_price_pkr && product.original_price_pkr > product.price_pkr
      ? Math.round(
          ((product.original_price_pkr - product.price_pkr) / product.original_price_pkr) * 100,
        )
      : 0;

  const originalStock = product.original_stock ?? Math.max(product.stock + 1, 3);
  const stockPct = Math.max(
    8,
    Math.round((product.stock / Math.max(originalStock, 1)) * 100),
  );

  const onlyOne = product.stock === 1;
  const soldOut = product.stock === 0;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {product.brand}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            {product.name}
          </h1>
        </div>
        <WishlistButton productId={product.id} productName={product.name} className="h-11 w-11" />
      </div>

      <div>
        <div className="flex items-baseline gap-3">
          <p className="font-display text-3xl font-semibold">{formatPKR(product.price_pkr)}</p>
          {product.original_price_pkr && product.original_price_pkr > product.price_pkr && (
            <>
              <p className="text-base text-muted-foreground line-through">
                {formatPKR(product.original_price_pkr)}
              </p>
              <span className="rounded-full bg-accent-red/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-red">
                Save {discount}%
              </span>
            </>
          )}
        </div>
        <p
          dir="rtl"
          lang="ur"
          className="mt-1 text-xs text-muted-foreground"
          title="Urdu transliteration of the price"
        >
          {pkrToUrduWords(product.price_pkr)}
        </p>
      </div>

      {!soldOut && product.stock <= 3 && (
        <div className="flex items-center gap-2 text-xs">
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{watching} people looking at this right now</span>
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.15em]">
          <span
            className={
              onlyOne ? "text-accent-red" : soldOut ? "text-muted-foreground" : "text-ink"
            }
          >
            {soldOut
              ? "Sold out"
              : onlyOne
                ? "Only 1 piece available"
                : `${product.stock} left in stock`}
          </span>
          <span className="text-muted-foreground">{product.condition} condition</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-cream">
          <div
            className={`h-full rounded-full ${onlyOne ? "bg-accent-red" : "bg-ink"}`}
            style={{ width: `${stockPct}%` }}
          />
        </div>
      </div>

      {product.size && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {[product.size].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`min-w-13 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition ${
                  selectedSize === s
                    ? "border-ink bg-ink text-paper"
                    : "border-border bg-paper text-ink hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <SizeGuideModal category={product.category} />
          </div>
        </div>
      )}

      <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

      {soldOut ? (
        <RestockNotify productName={product.name} />
      ) : (
        <>
          <AddToCartButton product={product} selectedSize={selectedSize} />
          <DeliveryCountdown />
        </>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <CompareToggle product={product} />
        <PriceDropToggle product={product} />
      </div>

      <div className="flex items-center gap-2">
        <a
          href={waLink(`Hi! Is "${product.name}" still available? ${product.size ? `(Size ${product.size})` : ""}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition hover:border-ink"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Ask on WhatsApp
        </a>
        <button
          onClick={onCopy}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition hover:border-ink"
          aria-label="Copy link"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
            } else {
              onCopy();
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition hover:border-ink"
          aria-label="Share"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <StickyBuyBar product={product} selectedSize={selectedSize} />

      <Accordion
        defaultOpen="details"
        items={[
          {
            id: "details",
            title: "Details & Materials",
            content: (
              <dl className="space-y-2">
                <Row label="Brand" value={product.brand} />
                <Row label="Category" value={product.category} />
                <Row label="Condition" value={`${product.condition} condition`} />
                {product.fabric && <Row label="Fabric" value={product.fabric} />}
                {product.measurements && <Row label="Measurements" value={product.measurements} />}
                {product.care && <Row label="Care" value={product.care} />}
              </dl>
            ),
          },
          {
            id: "delivery",
            title: "Delivery & COD",
            content: (
              <div className="space-y-2">
                <p>• Flat delivery all over Pakistan — {siteConfig.shipping.deliveryDays}.</p>
                <p>• Pay in cash when your order arrives. No advance payment.</p>
                <p>• We call before dispatch to confirm your address.</p>
                <p>• 3-day easy returns if the item doesn&apos;t match the listing.</p>
              </div>
            ),
          },
          {
            id: "authenticity",
            title: "Authenticity & Condition",
            content: (
              <p>
                Every piece is hand-picked and inspected by our team. Condition is graded on a
                10-point scale and photographed as-is. What you see is what you get.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-ink">
      <dt className="w-32 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="capitalize">{value}</dd>
    </div>
  );
}
