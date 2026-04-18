import { ImageResponse } from "next/og";
import { fetchProductBySlug } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";
import { formatPKR } from "@/lib/format";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = Promise<{ slug: string }>;

export default async function OG({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0a",
            color: "#faf9f6",
            fontSize: 64,
            fontFamily: "Georgia, serif",
          }}
        >
          {siteConfig.name}
        </div>
      ),
      size,
    );
  }

  const hero = product.images[0];
  const discount =
    product.original_price_pkr && product.original_price_pkr > product.price_pkr
      ? Math.round(
          ((product.original_price_pkr - product.price_pkr) / product.original_price_pkr) * 100,
        )
      : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
          color: "#faf9f6",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Left: product photo */}
        {hero && (
          <div style={{ width: "46%", height: "100%", display: "flex", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero}
              alt=""
              width={552}
              height={630}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Right: typography */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 64px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 18,
                letterSpacing: 6,
                textTransform: "uppercase",
                opacity: 0.7,
                fontFamily: "Helvetica, Arial, sans-serif",
                display: "flex",
              }}
            >
              {product.brand}
            </div>
            <div
              style={{
                fontSize: 68,
                lineHeight: 1.02,
                letterSpacing: -1,
                marginTop: 18,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {product.name}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <div style={{ fontSize: 56 }}>{formatPKR(product.price_pkr)}</div>
              {product.original_price_pkr &&
                product.original_price_pkr > product.price_pkr && (
                  <div
                    style={{
                      fontSize: 24,
                      textDecoration: "line-through",
                      opacity: 0.5,
                      display: "flex",
                      fontFamily: "Helvetica, Arial, sans-serif",
                    }}
                  >
                    {formatPKR(product.original_price_pkr)}
                  </div>
                )}
              {discount >= 20 && (
                <div
                  style={{
                    background: "#c1121f",
                    color: "#faf9f6",
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontSize: 18,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    display: "flex",
                  }}
                >
                  -{discount}%
                </div>
              )}
            </div>
            <div
              style={{
                marginTop: 36,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 14,
                letterSpacing: 4,
                textTransform: "uppercase",
                opacity: 0.75,
                fontFamily: "Helvetica, Arial, sans-serif",
              }}
            >
              <span>{siteConfig.name}</span>
              <span>Cash on Delivery · Pakistan</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
