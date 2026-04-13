import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { fetchAllSlugs } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const routes = ["", "/shop", "/deals", "/about", "/contact", "/cart"];
  const cats = CATEGORIES.map((c) => `/category/${c.slug}`);
  const slugs = await fetchAllSlugs();

  const now = new Date();

  return [
    ...routes.map((r) => ({ url: `${base}${r}`, lastModified: now })),
    ...cats.map((r) => ({ url: `${base}${r}`, lastModified: now })),
    ...slugs.map((s) => ({ url: `${base}/product/${s}`, lastModified: now })),
  ];
}
