import { ImageResponse } from "next/og";
import { fetchCollectionBySlug } from "@/lib/collections";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = Promise<{ slug: string }>;

export default async function OG({ params }: { params: Params }) {
  const { slug } = await params;
  const detail = await fetchCollectionBySlug(slug);

  if (!detail) {
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

  const { collection, products } = detail;

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
          position: "relative",
        }}
      >
        {collection.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={collection.cover_image}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.45,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.9) 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 18,
                letterSpacing: 8,
                textTransform: "uppercase",
                opacity: 0.8,
                fontFamily: "Helvetica, Arial, sans-serif",
                display: "flex",
              }}
            >
              The Collections · Chapter
            </div>
            <div
              style={{
                fontSize: 112,
                lineHeight: 0.96,
                letterSpacing: -3,
                marginTop: 28,
                display: "flex",
                flexWrap: "wrap",
                maxWidth: 1040,
              }}
            >
              {collection.title}
            </div>
            {collection.subtitle && (
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: 30,
                  opacity: 0.85,
                  marginTop: 28,
                  maxWidth: 820,
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {collection.subtitle}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
              letterSpacing: 4,
              textTransform: "uppercase",
              opacity: 0.8,
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            <span>{siteConfig.name}</span>
            <span>{products.length} pieces · curated</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
