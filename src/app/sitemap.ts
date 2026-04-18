import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { fetchAllSlugs } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";
import { fetchCollections } from "@/lib/collections";
import { fetchStyles } from "@/lib/styles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/deals`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const cats: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const [slugs, collections, styles] = await Promise.all([
    fetchAllSlugs(),
    fetchCollections(),
    fetchStyles(),
  ]);

  const products: MetadataRoute.Sitemap = slugs.map((s) => ({
    url: `${base}/product/${s}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${base}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const styleRoutes: MetadataRoute.Sitemap = styles.map((s) => ({
    url: `${base}/style/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...cats, ...products, ...collectionRoutes, ...styleRoutes];
}
