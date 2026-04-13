export type Category = "men" | "women" | "kids" | "shoes" | "bags";

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "men", label: "Men" },
  { slug: "women", label: "Women" },
  { slug: "kids", label: "Kids" },
  { slug: "shoes", label: "Shoes" },
  { slug: "bags", label: "Bags" },
];

export const SIZES = ["S", "M", "L", "XL"] as const;
export type Size = (typeof SIZES)[number] | "Free";

export type ProductTag = "new" | "trending" | "limited";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  brand: string;
  category: Category;
  price_pkr: number;
  size: string;
  condition: string;
  stock: number;
  images: string[];
  tags: ProductTag[];
  created_at: string;
}

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price_pkr: number;
  image: string;
  size: string;
  quantity: number;
  maxStock: number;
}

export type PaymentMethod = "cod";

export interface OrderDraft {
  full_name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  subtotal_pkr: number;
  items: CartItem[];
  paymentMethod: PaymentMethod;
}
