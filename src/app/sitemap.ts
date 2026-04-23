import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { fetchAllSlugs, fetchProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";
import { summariseBrands } from "@/lib/brands";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`,         lastModified: now, changeFrequency: "daily",   priority: 1 },
    { url: `${base}/shop`,     lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/deals`,    lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/lookbook`, lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/brands`,   lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${base}/compare`,  lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/faq`,      lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`,  lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
  const cats: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));
  const slugs = await fetchAllSlugs();
  const products: MetadataRoute.Sitemap = slugs.map((s) => ({
    url: `${base}/product/${s}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const brandRoutes: MetadataRoute.Sitemap = summariseBrands(
    await fetchProducts({ limit: 500 }),
  ).map((b) => ({
    url: `${base}/brands/${b.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));
  return [...staticRoutes, ...cats, ...brandRoutes, ...products];
}
