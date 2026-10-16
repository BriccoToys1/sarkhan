import { error, json } from "@/lib/api";
import { markOrderPaid } from "@/lib/orders";
import { getStripe } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return error("Stripe не настроен", 501);

  const raw = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, request.headers.get("stripe-signature") ?? "", secret);
  } catch {
    return error("Неверная подпись", 400);
  }

  if (event.type === "payment_intent.succeeded") {
    const orderId = event.data.object.metadata?.orderId;
    if (orderId) await markOrderPaid(orderId);
  }
  return json({ received: true });
}
