import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { fetchCollectionBySlug, fetchCollections } from "@/lib/collections";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const detail = await fetchCollectionBySlug(slug);
  if (!detail) return { title: "Collection not found" };
  return {
    title: detail.collection.title,
    description: detail.collection.subtitle ?? undefined,
    openGraph: {
      title: detail.collection.title,
      description: detail.collection.subtitle ?? undefined,
      images: detail.collection.cover_image ? [detail.collection.cover_image] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const cs = await fetchCollections();
  return cs.map((c) => ({ slug: c.slug }));
}

export default async function CollectionDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const detail = await fetchCollectionBySlug(slug);
  if (!detail) notFound();

  const { collection, products } = detail;
  const paragraphs = (collection.description_md ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {/* Full-bleed editorial hero */}
      <section className="relative isolate overflow-hidden border-b border-border bg-ink text-paper">
        {collection.cover_image && (
          <Image
            src={collection.cover_image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover opacity-55"
          />
        )}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-ink/90 via-ink/30 to-ink/45" />
        <div className="pointer-events-none absolute inset-0 -z-10 noise opacity-30" aria-hidden />

        <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:pt-40 lg:pb-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-paper/80">
            The Collections · Chapter
          </p>
          <Reveal>
            <h1 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.02em] sm:text-7xl lg:text-[112px]">
              {collection.title}
            </h1>
          </Reveal>
          {collection.subtitle && (
            <Reveal delay={120}>
              <p className="mt-8 max-w-2xl font-display text-xl italic text-paper/85 sm:text-2xl">
                {collection.subtitle}
              </p>
            </Reveal>
          )}
          <Reveal delay={200}>
            <div className="mt-10 flex flex-wrap items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70">
              <span>{products.length} pieces</span>
              <span className="h-px w-8 bg-paper/40" />
              <span>Curated by {siteConfig.name}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "The Collections", href: "/collections" },
            { label: collection.title },
          ]}
        />
      </div>

      {/* Editor's note */}
      {paragraphs.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
          <Reveal>
            <p className="eyebrow">Editor&apos;s Note</p>
          </Reveal>
          <div className="mt-5 space-y-5 font-display text-xl leading-[1.55] text-ink sm:text-[22px]">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={paragraphs.length * 60}>
            <div className="mt-10 h-px w-20 bg-ink" />
          </Reveal>
        </section>
      )}

      {/* Product grid */}
      {products.length === 0 ? (
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <p className="font-display text-2xl">The pieces are being styled.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            This chapter is drafted — products will be added shortly.
          </p>
          <Link
            href="/collections/all"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper hover:opacity-90"
          >
            Shop all
          </Link>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:pb-28">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">The pieces</h2>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {products.length} in this edit
            </p>
          </div>
          <ProductGrid products={products} />
        </section>
      )}

      {/* Back link */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all collections
        </Link>
      </section>
    </>
  );
}
