import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.commerce.coinbase.com";

function headers() {
  return {
    "Content-Type": "application/json",
    "X-CC-Api-Key": process.env.COINBASE_COMMERCE_API_KEY ?? "",
    "X-CC-Version": "2018-03-22",
  };
}

type Charge = { id: string; code: string; hosted_url: string; timeline?: { status: string }[] };

export async function createCharge(order: { id: string; number: number; total: number; redirectUrl: string; cancelUrl: string }) {
  const res = await fetch(`${API}/charges`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      name: `Sarkhan Grim · заказ #${order.number}`,
      description: "Mystical Cards & Esoteric Artifacts",
      pricing_type: "fixed_price",
      local_price: { amount: order.total.toFixed(2), currency: "RUB" },
      metadata: { orderId: order.id, orderNumber: String(order.number) },
      redirect_url: order.redirectUrl,
      cancel_url: order.cancelUrl,
    }),
  });
  if (!res.ok) throw new Error(`Coinbase Commerce: ${res.status}`);
  const { data } = (await res.json()) as { data: Charge };
  return { id: data.id, code: data.code, hostedUrl: data.hosted_url };
}

export async function isChargePaid(id: string) {
  const res = await fetch(`${API}/charges/${encodeURIComponent(id)}`, { headers: headers() });
  if (!res.ok) return false;
  const { data } = (await res.json()) as { data: Charge };
  const statuses = (data.timeline ?? []).map((t) => t.status);
  return statuses.includes("COMPLETED") || statuses.includes("RESOLVED");
}

export function verifyCoinbaseSignature(rawBody: string, signature: string | null) {
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
