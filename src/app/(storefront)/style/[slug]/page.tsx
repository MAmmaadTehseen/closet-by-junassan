import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { fetchStyleWithProducts, fetchStyles } from "@/lib/styles";
import ProductGrid from "@/components/product/ProductGrid";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import Reveal from "@/components/ui/Reveal";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const detail = await fetchStyleWithProducts(slug);
  if (!detail) return { title: "Style not found" };
  return {
    title: `${detail.style.label} · Shop the mood`,
    description: detail.style.description ?? undefined,
  };
}

export async function generateStaticParams() {
  const styles = await fetchStyles();
  return styles.map((s) => ({ slug: s.slug }));
}

export default async function StyleDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const detail = await fetchStyleWithProducts(slug);
  if (!detail) notFound();
  const { style, products } = detail;

  return (
    <>
      {/* Mood-board hero — big editorial typography with image gradient */}
      <section className="relative isolate overflow-hidden border-b border-border bg-ink text-paper">
        {style.cover_image && (
          <Image
            src={style.cover_image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover opacity-55"
          />
        )}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/40 to-ink/20" />
        <div className="pointer-events-none absolute inset-0 -z-10 noise opacity-30" aria-hidden />

        <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:pt-40 lg:pb-24">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-paper/80">
            Shop by style · Mood board
          </p>
          <Reveal>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.88] tracking-[-0.03em] sm:text-8xl lg:text-[160px]">
              {style.label}
            </h1>
          </Reveal>
          {style.description && (
            <Reveal delay={120}>
              <p className="mt-8 max-w-2xl font-display text-xl italic text-paper/85 sm:text-2xl">
                {style.description}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop by style", href: "/shop" },
            { label: style.label },
          ]}
        />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-paper p-16 text-center">
            <p className="font-display text-2xl">Nothing tagged yet.</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Add <span className="font-semibold text-ink">{style.slug}</span> to a
              product&apos;s tags to see it appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">The pieces</h2>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {products.length} in this mood
              </p>
            </div>
            <ProductGrid products={products} />
          </>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Link
          href="/collections/all"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to shop
        </Link>
      </section>
    </>
  );
}
