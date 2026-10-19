import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}

export async function createPaymentIntent(order: { id: string; number: number; email: string; totalCents: number }) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe не настроен");
  return stripe.paymentIntents.create(
    {
      amount: order.totalCents,
      currency: "rub",
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      receipt_email: order.email,
      description: `Sarkhan Grim — заказ #${order.number}`,
      metadata: { orderId: order.id, orderNumber: String(order.number) },
    },
    { idempotencyKey: `order-${order.id}` },
  );
}

export async function isPaymentIntentPaid(id: string) {
  const stripe = getStripe();
  if (!stripe) return false;
  const intent = await stripe.paymentIntents.retrieve(id);
  return intent.status === "succeeded";
}
