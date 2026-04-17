import type { CartItem } from "./types";

export interface CheckoutPayload {
  full_name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  email?: string;
  items: CartItem[];
  honeypot?: string;
  idempotencyKey?: string;
}
