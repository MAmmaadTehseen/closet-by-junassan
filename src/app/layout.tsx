import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import DevBanner from "@/components/ui/DevBanner";
import { getLang } from "@/lib/i18n";

const ceramic = localFont({
  src: [
    {
      path: "../../public/fonts/Ceramic.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-ceramic",
  display: "swap",
  fallback: ["Georgia", "ui-serif", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "thrift store Pakistan",
    "branded clothing Pakistan",
    "affordable fashion",
    "COD fashion Pakistan",
    "preloved clothing",
    "women clothing Pakistan",
    "men clothing Pakistan",
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon-192.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLang();
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    sameAs: [siteConfig.socials.instagram, siteConfig.socials.facebook],
    description: siteConfig.description,
  };

  return (
    <html lang={lang} className={ceramic.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <DevBanner />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
