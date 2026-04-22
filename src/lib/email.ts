import { siteConfig } from "@/lib/site-config";
import { formatPKR } from "@/lib/format";

type LineItem = { name: string; quantity: number; price_pkr: number; size?: string | null };

export interface OrderEmailContext {
  email: string;
  firstName: string;
  code: string;
  items: LineItem[];
  total: number;
  address: string;
  city: string;
  phone: string;
  status?: string;
}

function isConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.FROM_EMAIL);
}

async function send(params: { to: string; subject: string; html: string }) {
  if (!isConfigured()) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    });
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

const base = (title: string, body: string) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>${title}</title>
  </head>
  <body style="margin:0;background:#f1ede4;font-family:Helvetica,Arial,sans-serif;color:#0a0a0a;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <h1 style="font-family:Georgia,serif;font-size:28px;letter-spacing:-0.01em;margin:0 0 8px;">${siteConfig.name}</h1>
      <div style="height:1px;background:#e7e2d5;margin:24px 0;"></div>
      ${body}
      <div style="height:1px;background:#e7e2d5;margin:32px 0;"></div>
      <p style="font-size:11px;color:#6b6357;line-height:1.6;">
        ${siteConfig.name} · ${siteConfig.tagline}<br/>
        Questions? WhatsApp us at +${siteConfig.contact.whatsappNumber}.
      </p>
    </div>
  </body>
</html>`;

function itemsTable(items: LineItem[]) {
  return `<table style="width:100%;border-collapse:collapse;margin:20px 0;">
    ${items
      .map(
        (it) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e7e2d5;font-size:14px;">
          ${it.name}${it.size ? ` <span style="color:#6b6357;">· ${it.size}</span>` : ""}
          <span style="color:#6b6357;"> × ${it.quantity}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #e7e2d5;text-align:right;font-size:14px;">
          ${formatPKR(it.price_pkr * it.quantity)}
        </td>
      </tr>`,
      )
      .join("")}
  </table>`;
}

export async function sendOrderConfirmation(ctx: OrderEmailContext) {
  if (!isConfigured() || !ctx.email) return;
  const trackHref = `${siteConfig.url}/track?code=${encodeURIComponent(ctx.code)}`;
  const body = `
    <p style="font-size:14px;color:#6b6357;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 6px;">Order confirmed</p>
    <h2 style="font-family:Georgia,serif;font-size:32px;margin:0 0 16px;">Thanks, ${ctx.firstName}.</h2>
    <p style="font-size:14px;line-height:1.6;">We've got your order. We'll call to confirm your address within 24 hours.</p>
    <div style="margin:20px 0;padding:16px;background:#faf9f6;border-radius:12px;">
      <p style="margin:0;font-size:12px;color:#6b6357;letter-spacing:0.18em;text-transform:uppercase;">Order number</p>
      <p style="margin:4px 0 0;font-family:Georgia,serif;font-size:24px;">${ctx.code}</p>
    </div>
    ${itemsTable(ctx.items)}
    <p style="display:flex;justify-content:space-between;font-size:16px;font-weight:600;margin:8px 0 24px;">
      <span>Total (COD)</span><span>${formatPKR(ctx.total)}</span>
    </p>
    <p style="font-size:13px;color:#6b6357;line-height:1.6;">
      <strong>Delivery to:</strong><br/>${ctx.address}, ${ctx.city}<br/>Phone: ${ctx.phone}
    </p>
    <a href="${trackHref}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#0a0a0a;color:#faf9f6;text-decoration:none;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;">Track your order</a>
  `;
  await send({
    to: ctx.email,
    subject: `Order ${ctx.code} confirmed — ${siteConfig.name}`,
    html: base(`Order ${ctx.code} confirmed`, body),
  });
}

export async function sendStatusUpdate(
  ctx: Omit<OrderEmailContext, "items" | "total" | "address" | "city"> & { status: string },
) {
  if (!isConfigured() || !ctx.email) return;
  const trackHref = `${siteConfig.url}/track?code=${encodeURIComponent(ctx.code)}`;
  const headlines: Record<string, string> = {
    confirmed: "We've confirmed your order.",
    shipped: "Your order is on its way!",
    delivered: "Your order was delivered.",
    cancelled: "Your order was cancelled.",
  };
  const subs: Record<string, string> = {
    confirmed: "Our team verified your address and is prepping the items now.",
    shipped: "The courier picked up your package. Keep your phone handy for the delivery call.",
    delivered: "Thanks for shopping with us. Tap below to leave a review — it keeps the good finds coming.",
    cancelled: "If this wasn't you, reply to this email or WhatsApp us right away.",
  };
  const headline = headlines[ctx.status] ?? "Order update";
  const sub = subs[ctx.status] ?? "";
  const reviewHref = `${siteConfig.url}/review/${encodeURIComponent(ctx.code)}`;
  const primaryHref = ctx.status === "delivered" ? reviewHref : trackHref;
  const primaryLabel = ctx.status === "delivered" ? "Leave a review" : "Track your order";

  const body = `
    <p style="font-size:14px;color:#6b6357;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 6px;">Order ${ctx.code}</p>
    <h2 style="font-family:Georgia,serif;font-size:30px;margin:0 0 14px;">${headline}</h2>
    <p style="font-size:14px;line-height:1.6;">Hi ${ctx.firstName}, ${sub}</p>
    <a href="${primaryHref}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#0a0a0a;color:#faf9f6;text-decoration:none;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;">${primaryLabel}</a>
  `;
  await send({
    to: ctx.email,
    subject: `${headline} — ${ctx.code}`,
    html: base(headline, body),
  });
}

export async function sendCartRecovery(ctx: {
  email: string;
  token: string;
  items: LineItem[];
}) {
  if (!isConfigured() || !ctx.email) return;
  const link = `${siteConfig.url}/cart/recover/${ctx.token}`;
  const total = ctx.items.reduce((n, i) => n + i.price_pkr * i.quantity, 0);
  const body = `
    <p style="font-size:14px;color:#6b6357;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 6px;">Still thinking it over?</p>
    <h2 style="font-family:Georgia,serif;font-size:32px;margin:0 0 14px;">Your bag is waiting.</h2>
    <p style="font-size:14px;line-height:1.6;">We&apos;ve saved your picks — restore them in one tap and checkout where you left off.</p>
    ${itemsTable(ctx.items)}
    <p style="display:flex;justify-content:space-between;font-size:16px;font-weight:600;margin:8px 0 24px;"><span>Bag total</span><span>${formatPKR(total)}</span></p>
    <a href="${link}" style="display:inline-block;margin:12px 0 8px;padding:14px 28px;background:#0a0a0a;color:#faf9f6;text-decoration:none;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;">Restore my bag</a>
    <p style="font-size:11px;color:#6b6357;margin-top:20px;">Sold out? We&apos;ll let you know. Prices may adjust — original terms apply.</p>
  `;
  await send({
    to: ctx.email,
    subject: `Your Closet bag is waiting`,
    html: base("Your bag is waiting", body),
  });
}
