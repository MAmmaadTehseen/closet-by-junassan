export const siteConfig = {
  name: "Closet by Junassan",
  shortName: "Closet",
  tagline: "Affordable Branded Fashion for Everyone",
  description:
    "Curated thrift store offering affordable branded clothing, shoes, and accessories for men, women, and kids. Cash on Delivery all over Pakistan.",
  url: "https://closetbyjunassan.com",

  contact: {
    whatsappNumber: "923000000000",
    email: "hello@closetbyjunassan.com",
  },

  socials: {
    instagram: "https://instagram.com/closetbyjunassan",
    facebook: "https://facebook.com/closetbyjunassan",
    tiktok: "https://tiktok.com/@closetbyjunassan",
  },

  shipping: {
    banner: "Cash on Delivery Available All Over Pakistan",
    note: "Flat delivery across Pakistan",
  },

  currency: {
    code: "PKR",
    symbol: "Rs",
  },
} as const;

export const waLink = (msg = "Hi! I'd like to ask about a product."): string =>
  `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(msg)}`;
