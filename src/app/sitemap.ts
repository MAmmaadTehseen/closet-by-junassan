import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { fetchAllSlugs } from "@/lib/products";
import { JOURNAL } from "@/lib/journal";
import { CATEGORIES } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/deals`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/bundles`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/rewards`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/gift-cards`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/referrals`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/ambassadors`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/size-converter`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
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
  const journal: MetadataRoute.Sitemap = JOURNAL.map((p) => ({
    url: `${base}/journal/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...staticRoutes, ...cats, ...products, ...journal];
}
