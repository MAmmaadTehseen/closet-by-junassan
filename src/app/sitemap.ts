import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { fetchAllSlugs } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";
import { JOURNAL } from "@/lib/journal";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`,              lastModified: now, changeFrequency: "daily",   priority: 1 },
    { url: `${base}/shop`,          lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/deals`,         lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/bundles`,       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/lookbook`,      lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/journal`,       lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/compare`,       lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/gift-cards`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/rewards`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/refer`,         lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/fit-finder`,    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/style-quiz`,    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/size-guide`,    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/delivery`,      lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/brands`,        lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/sustainability`,lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`,         lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`,       lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
  const journalRoutes: MetadataRoute.Sitemap = JOURNAL.map((p) => ({
    url: `${base}/journal/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));
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
  return [...staticRoutes, ...journalRoutes, ...cats, ...products];
}
