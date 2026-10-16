import { error, json } from "@/lib/api";
import { markOrderPaid } from "@/lib/orders";
import { verifyCoinbaseSignature } from "@/lib/payments/coinbase";

type CoinbaseEvent = { event?: { type?: string; data?: { metadata?: { orderId?: string } } } };

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyCoinbaseSignature(raw, request.headers.get("x-cc-webhook-signature"))) return error("Неверная подпись", 400);

  const payload = JSON.parse(raw) as CoinbaseEvent;
  const type = payload.event?.type;
  const orderId = payload.event?.data?.metadata?.orderId;
  if (orderId && (type === "charge:confirmed" || type === "charge:resolved")) await markOrderPaid(orderId);
  return json({ received: true });
}
