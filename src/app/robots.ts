import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/checkout/success", "/cart", "/wishlist", "/admin"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
