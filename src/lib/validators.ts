import { PK_CITIES } from "./cities-pk";

export interface CheckoutInput {
  full_name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: { product_id: string; quantity: number }[];
  honeypot?: string;
  idempotencyKey?: string;
}

export interface ValidationResult<T> {
  ok: boolean;
  data?: T;
  errors?: Record<string, string>;
}

const PHONE_RE = /^03[0-9]{9}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function clean(s: unknown): string {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("92") && digits.length === 12) return "0" + digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) return digits;
  return digits;
}

export function validateCheckout(raw: unknown): ValidationResult<Required<Omit<CheckoutInput, "honeypot" | "idempotencyKey">> & { notes: string }> {
  const errors: Record<string, string> = {};
  const input = (raw ?? {}) as Record<string, unknown>;

  // Honeypot — silently pass validation; caller will treat it as a no-op.
  // (We still return ok:true here; the server action checks the honeypot separately.)

  const full_name = clean(input.full_name);
  if (full_name.length < 2 || full_name.length > 80) errors.full_name = "Please enter your full name.";

  const phone = normalizePhone(clean(input.phone));
  if (!PHONE_RE.test(phone)) errors.phone = "Enter a valid PK mobile (03XXXXXXXXX).";

  const city = clean(input.city);
  if (city.length < 2 || city.length > 60) errors.city = "Please enter your city.";
  else if (!PK_CITIES.some((c) => c.toLowerCase() === city.toLowerCase())) {
    // Warn but don't block — accept the closest form.
  }

  const address = clean(input.address);
  if (address.length < 5 || address.length > 300) errors.address = "Please enter a full address.";

  const notes = clean(input.notes).slice(0, 500);

  const rawItems = Array.isArray(input.items) ? (input.items as unknown[]) : [];
  const items: { product_id: string; quantity: number }[] = [];
  if (rawItems.length === 0) {
    errors.items = "Your cart is empty.";
  } else if (rawItems.length > 20) {
    errors.items = "Too many items.";
  } else {
    for (const it of rawItems) {
      const obj = (it ?? {}) as Record<string, unknown>;
      const product_id = clean(obj.product_id);
      const quantity = Math.floor(Number(obj.quantity ?? 0));
      if (!UUID_RE.test(product_id) && !/^p\d+$/.test(product_id)) {
        errors.items = "Invalid item id.";
        break;
      }
      if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 10) {
        errors.items = "Invalid item quantity.";
        break;
      }
      items.push({ product_id, quantity });
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: {
      full_name,
      phone,
      city: titleCase(city),
      address,
      notes,
      items,
    },
  };
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export { PHONE_RE, normalizePhone };
