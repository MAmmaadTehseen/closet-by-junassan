import { cookies } from "next/headers";

export type Lang = "en" | "ur";
export const DEFAULT_LANG: Lang = "en";
export const COOKIE_KEY = "closet-lang";

const dict = {
  // Navigation & header
  "nav.shop": { en: "Shop", ur: "شاپ" },
  "nav.collections": { en: "Collections", ur: "کلیکشنز" },
  "nav.deals": { en: "Deals", ur: "رعایتیں" },
  "nav.wishlist": { en: "Wishlist", ur: "پسندیدہ" },
  "nav.about": { en: "About", ur: "ہمارے بارے میں" },
  "nav.contact": { en: "Contact", ur: "رابطہ" },
  "nav.my": { en: "My Closet", ur: "میری الماری" },
  "nav.home": { en: "Home", ur: "ہوم" },

  // Hero
  "hero.eyebrow": { en: "Curated Thrift · Weekly Drops", ur: "چنیدہ تھرفٹ · ہفتہ وار ڈراپ" },
  "hero.cta_primary": { en: "Shop the Drop", ur: "ڈراپ خریدیں" },
  "hero.cta_secondary": { en: "Under 2000 PKR", ur: "2000 سے کم میں" },

  // Product
  "product.add_to_bag": { en: "Add to Bag", ur: "بیگ میں ڈالیں" },
  "product.buy_now": { en: "Buy Now", ur: "ابھی خریدیں" },
  "product.sold_out": { en: "Sold out", ur: "فروخت ہو چکا" },
  "product.make_offer": { en: "Make an offer", ur: "قیمت کی پیشکش" },
  "product.price_drop": { en: "Notify on price drop", ur: "قیمت کم ہونے پر اطلاع" },

  // Cart & checkout
  "checkout.cod": { en: "Cash on Delivery", ur: "کیش آن ڈیلیوری" },
  "checkout.place_order": { en: "Place order", ur: "آرڈر دیں" },
  "checkout.track_order": { en: "Track order", ur: "آرڈر ٹریک کریں" },

  // Common
  "common.free_delivery": { en: "Free Delivery", ur: "مفت ترسیل" },
  "common.earn_coins": { en: "Earn coins", ur: "سکے کمائیں" },
} as const;

export type TranslationKey = keyof typeof dict;

export async function getLang(): Promise<Lang> {
  try {
    const store = await cookies();
    const v = store.get(COOKIE_KEY)?.value;
    return v === "ur" ? "ur" : "en";
  } catch {
    return DEFAULT_LANG;
  }
}

export function t(key: TranslationKey, lang: Lang): string {
  return dict[key][lang] ?? dict[key].en;
}

/** Create a translator bound to the current request's language. */
export async function getT(): Promise<(key: TranslationKey) => string> {
  const lang = await getLang();
  return (key: TranslationKey) => t(key, lang);
}
