// Pure, bundler-safe i18n primitives. No `next/headers` import here so this
// file is importable from client components. Server-only helpers that read
// the language cookie live in `./i18n-server.ts`.

export type Lang = "en" | "ur";
export const DEFAULT_LANG: Lang = "en";
export const COOKIE_KEY = "closet-lang";

// Customer-facing strings. Admin UI is intentionally English-only.
// Keys are flat + namespaced ("nav.shop"). Each value has en + ur.
export const DICT = {
  // Navigation
  "nav.shop": { en: "Shop", ur: "شاپ" },
  "nav.collections": { en: "Collections", ur: "کلیکشنز" },
  "nav.deals": { en: "Deals", ur: "رعایتیں" },
  "nav.wishlist": { en: "Wishlist", ur: "پسندیدہ" },
  "nav.about": { en: "About", ur: "ہمارے بارے میں" },
  "nav.contact": { en: "Contact", ur: "رابطہ" },
  "nav.my": { en: "My Closet", ur: "میری الماری" },
  "nav.home": { en: "Home", ur: "ہوم" },
  "nav.men": { en: "Men", ur: "مرد" },
  "nav.women": { en: "Women", ur: "خواتین" },
  "nav.shoes": { en: "Shoes", ur: "جوتے" },
  "nav.search": { en: "Search", ur: "تلاش" },
  "nav.cart": { en: "Cart", ur: "کارٹ" },
  "nav.menu_open": { en: "Open menu", ur: "مینیو کھولیں" },
  "nav.menu_close": { en: "Close menu", ur: "مینیو بند کریں" },
  "nav.my_orders": { en: "My Orders", ur: "میرے آرڈرز" },

  // Hero
  "hero.eyebrow": { en: "Curated Thrift · Weekly Drops", ur: "چنیدہ تھرفٹ · ہفتہ وار ڈراپ" },
  "hero.headline_a": { en: "Wear the Brand.", ur: "برانڈ پہنیں۔" },
  "hero.headline_b": { en: "Own the Moment.", ur: "لمحہ اپنا بنائیں۔" },
  "hero.subheading": {
    en: "Hand-picked preloved pieces from the labels you love — delivered across Pakistan with Cash on Delivery.",
    ur: "پسندیدہ برانڈز سے چنیدہ پری لووڈ کپڑے — پورے پاکستان میں کیش آن ڈیلیوری کے ساتھ۔",
  },
  "hero.cta_primary": { en: "Shop the Drop", ur: "ڈراپ خریدیں" },
  "hero.cta_secondary": { en: "Under 2000 PKR", ur: "2000 سے کم میں" },
  "hero.stat_rating": { en: "4.9 · 2k+ happy buyers", ur: "4.9 · 2 ہزار سے زائد مطمئن خریدار" },
  "hero.stat_cod": { en: "COD all over Pakistan", ur: "پورے پاکستان میں COD" },
  "hero.stat_drops": { en: "New drops weekly", ur: "ہر ہفتے نیا ڈراپ" },

  // Product
  "product.add_to_bag": { en: "Add to Bag", ur: "بیگ میں ڈالیں" },
  "product.buy_now": { en: "Buy Now", ur: "ابھی خریدیں" },
  "product.sold_out": { en: "Sold out", ur: "فروخت ہو چکا" },
  "product.add": { en: "Add", ur: "شامل کریں" },
  "product.make_offer": { en: "Make an offer", ur: "قیمت کی پیشکش" },
  "product.price_drop": { en: "Notify on price drop", ur: "قیمت کم ہونے پر اطلاع" },
  "product.quick_add_aria": { en: "Add {name} to bag", ur: "{name} کو بیگ میں ڈالیں" },
  "product.added_toast": { en: "Added to bag — {name}", ur: "بیگ میں شامل ہو گیا — {name}" },

  // Cart
  "cart.title": { en: "Your Bag", ur: "آپ کا بیگ" },
  "cart.empty_title": { en: "Your bag is empty", ur: "آپ کا بیگ خالی ہے" },
  "cart.empty_body": {
    en: "Limited pieces drop every week. Find something you love.",
    ur: "ہر ہفتے محدود نمونے آتے ہیں۔ کچھ پسند کا ڈھونڈیں۔",
  },
  "cart.shop_new": { en: "Shop New Arrivals", ur: "نئی آمد دیکھیں" },
  "cart.size_label": { en: "Size", ur: "سائز" },
  "cart.subtotal": { en: "Subtotal", ur: "کل رقم" },
  "cart.flat_delivery": { en: "Flat delivery across Pakistan", ur: "پورے پاکستان میں یکساں ترسیل" },
  "cart.view_bag": { en: "View Bag", ur: "بیگ دیکھیں" },
  "cart.checkout": { en: "Checkout", ur: "چیک آؤٹ" },
  "cart.cod_available": { en: "Cash on Delivery available", ur: "کیش آن ڈیلیوری دستیاب" },
  "cart.qty_decrease": { en: "Decrease quantity", ur: "مقدار کم کریں" },
  "cart.qty_increase": { en: "Increase quantity", ur: "مقدار بڑھائیں" },
  "cart.remove": { en: "Remove", ur: "ہٹائیں" },

  // Checkout
  "checkout.eyebrow": { en: "Almost there", ur: "بس تھوڑا اور" },
  "checkout.title": { en: "Checkout", ur: "چیک آؤٹ" },
  "checkout.cod": { en: "Cash on Delivery", ur: "کیش آن ڈیلیوری" },
  "checkout.place_order": { en: "Place order", ur: "آرڈر دیں" },
  "checkout.track_order": { en: "Track order", ur: "آرڈر ٹریک کریں" },
  "checkout.success_eyebrow": { en: "Order confirmed", ur: "آرڈر کی تصدیق" },
  "checkout.success_title": { en: "Your order is on its way.", ur: "آپ کا آرڈر روانہ ہو چکا ہے۔" },
  "checkout.success_body": {
    en: "Thank you for shopping with {shop}. We'll take it from here.",
    ur: "{shop} سے خریداری کا شکریہ۔ باقی کا کام ہمارا ہے۔",
  },
  "checkout.success_copy_hint": { en: "Tap to copy your order code", ur: "آرڈر کوڈ کاپی کرنے کے لیے ٹیپ کریں" },
  "checkout.next_steps": { en: "What happens next", ur: "اب کیا ہوگا" },
  "checkout.step1_title": { en: "We call to confirm", ur: "ہم تصدیق کے لیے کال کرتے ہیں" },
  "checkout.step1_body": {
    en: "Our team calls within 24 hours to verify your order and address.",
    ur: "ہماری ٹیم 24 گھنٹوں میں آپ کا آرڈر اور پتہ تصدیق کرنے کے لیے کال کرتی ہے۔",
  },
  "checkout.step2_title": { en: "We pack your order", ur: "ہم آپ کا آرڈر پیک کرتے ہیں" },
  "checkout.step2_body": {
    en: "Every piece is inspected and carefully packed before dispatch.",
    ur: "ہر نمونہ معائنے کے بعد احتیاط سے پیک ہوتا ہے۔",
  },
  "checkout.step3_title": { en: "We deliver to you", ur: "ہم آپ تک پہنچاتے ہیں" },
  "checkout.step3_body_prefix": { en: "Est. delivery ", ur: "متوقع ترسیل " },
  "checkout.step3_body_suffix": {
    en: ". Pay in cash when it arrives.",
    ur: "۔ آنے پر نقد رقم دیں۔",
  },
  "checkout.continue_shopping": { en: "Continue shopping", ur: "خریداری جاری رکھیں" },
  "checkout.whatsapp_us": { en: "WhatsApp us", ur: "واٹس ایپ کریں" },
  "checkout.tag_us": { en: "Tag us @closetbyjunassan", ur: "ہمیں ٹیگ کریں @closetbyjunassan" },

  // Footer
  "footer.tagline": {
    en: "Curated thrift fashion from the brands you love — hand-picked, inspected, and priced for Pakistan.",
    ur: "پسندیدہ برانڈز سے چنیدہ تھرفٹ فیشن — خود منتخب، معائنہ شدہ، اور پاکستان کے لیے قیمتیں۔",
  },
  "footer.whatsapp_us": { en: "WhatsApp Us", ur: "واٹس ایپ کریں" },
  "footer.col_shop": { en: "Shop", ur: "شاپ" },
  "footer.col_help": { en: "Help", ur: "مدد" },
  "footer.col_connect": { en: "Connect", ur: "رابطہ" },
  "footer.under_2000": { en: "Under 2000 PKR", ur: "2000 سے کم" },
  "footer.all_products": { en: "All Products", ur: "تمام مصنوعات" },
  "footer.accessories": { en: "Accessories", ur: "لوازمات" },
  "footer.faq": { en: "FAQ", ur: "عمومی سوالات" },
  "footer.returns": { en: "Returns & Sizing", ur: "واپسی اور سائز" },
  "footer.track": { en: "Track Order", ur: "آرڈر ٹریک کریں" },
  "footer.privacy": { en: "Privacy Policy", ur: "رازداری کی پالیسی" },
  "footer.terms": { en: "Terms", ur: "شرائط" },
  "footer.rights": { en: "All rights reserved.", ur: "جملہ حقوق محفوظ ہیں۔" },

  // Common
  "common.free_delivery": { en: "Free Delivery", ur: "مفت ترسیل" },
  "common.earn_coins": { en: "Earn coins", ur: "سکے کمائیں" },
  "common.close": { en: "Close", ur: "بند کریں" },
} as const;

export type Dictionary = typeof DICT;
export type TranslationKey = keyof Dictionary;

export function t(key: TranslationKey, lang: Lang, vars?: Record<string, string>): string {
  const entry = DICT[key];
  const raw = entry[lang] ?? entry.en;
  if (!vars) return raw;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{${k}}`, v),
    raw as string,
  );
}
