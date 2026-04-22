export const siteConfig = {
  name: "Closet by Junassan",
  shortName: "Closet",
  tagline: "Affordable Branded Fashion for Everyone",
  description:
    "Curated thrift store offering affordable branded clothing, shoes, and accessories for men, women, and kids. Cash on Delivery all over Pakistan.",
  url: "https://closetbyjunassan.com",

  announcement:
    "Flat delivery across Pakistan • Cash on Delivery available • New drops every week",

  contact: {
    whatsappNumber: "923000000000",
    email: "hello@closetbyjunassan.com",
  },

  socials: {
    instagram: "https://instagram.com/closetbyjun123assan",
    facebook: "https://facebook.com/closetbyjunassan",
    tiktok: "https://tiktok.com/@closetbyjunassan",
  },

  shipping: {
    banner: "Cash on Delivery Available All Over Pakistan",
    note: "Flat delivery across Pakistan",
    deliveryDays: "3–5 working days",
  },

  currency: {
    code: "PKR",
    symbol: "Rs",
  },

  trust: [
    "No advance payment",
    "We call before dispatch",
    "3-day easy returns",
    "Pay when it arrives",
  ],

  perks: {
    freeGiftThreshold: 4000,
    freeGiftLabel: "a free mystery accessory",
  },
} as const;

export const waLink = (msg = "Hi! I'd like to ask about a product."): string =>
  `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(msg)}`;

export const telLink = (): string => `tel:+${siteConfig.contact.whatsappNumber}`;
