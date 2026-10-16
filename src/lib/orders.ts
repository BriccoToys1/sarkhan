import { randomBytes, randomInt } from "node:crypto";
import { prisma } from "./prisma";
import { calculateTotals, resolveShippingMethod, type PricingLine } from "./pricing";
import { BLESSINGS, SITE } from "./site";
import { sendOrderPaidEmail } from "./mail";
import { getPaymentConfig } from "./payments/config";
import { createPaymentIntent, isPaymentIntentPaid } from "./payments/stripe";
import { createCharge, isChargePaid } from "./payments/coinbase";
import type { OrderInput } from "./validation";
import type { ProductType, PromoRule } from "./types";

export class OrderError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export async function findPromo(code: string): Promise<PromoRule | null> {
  const promo = await prisma.promoCode.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!promo || !promo.active) return null;
  if (promo.validUntil && promo.validUntil < new Date()) return null;
  if (promo.usageLimit != null && promo.usageCount >= promo.usageLimit) return null;
  return {
    code: promo.code,
    type: promo.type,
    value: Number(promo.value),
    minSubtotal: promo.minSubtotal != null ? Number(promo.minSubtotal) : null,
    excludeOriginals: promo.excludeOriginals,
    description: promo.description,
  };
}

export type NextStep =
  | { type: "stripe"; clientSecret: string }
  | { type: "coinbase"; hostedUrl: string }
  | { type: "demo" };

export async function createOrder(input: OrderInput) {
  const config = getPaymentConfig();
  const provider =
    input.paymentMethod === "CARD"
      ? config.card === "stripe"
        ? "stripe"
        : config.card === "demo"
          ? "demo"
          : null
      : config.crypto === "coinbase"
        ? "coinbase"
        : config.crypto === "demo"
          ? "demo"
          : null;
  if (!provider) throw new OrderError("Этот способ оплаты временно недоступен", 503);

  const merged = new Map<string, number>();
  for (const item of input.items) merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);

  const products = await prisma.product.findMany({ where: { id: { in: [...merged.keys()] }, status: "PUBLISHED" } });
  if (products.length !== merged.size) throw new OrderError("Некоторые артефакты больше недоступны — обновите корзину", 409);

  const lines: (PricingLine & { product: (typeof products)[number] })[] = [];
  for (const product of products) {
    const quantity = merged.get(product.id)!;
    if (product.availability === "SOLD_OUT") throw new OrderError(`«${product.title}» уже продан`, 409);
    if (product.availability === "IN_STOCK" && quantity > product.stock) {
      throw new OrderError(
        product.stock > 0 ? `«${product.title}»: доступно только ${product.stock} шт.` : `«${product.title}» закончился`,
        409,
      );
    }
    lines.push({ price: Number(product.price), quantity, type: product.type as ProductType, product });
  }

  if (resolveShippingMethod(lines, input.shippingMethod) !== input.shippingMethod) {
    throw new OrderError("Стандартная доставка недоступна для оригиналов картин", 422);
  }

  let promo: PromoRule | null = null;
  if (input.promoCode) {
    promo = await findPromo(input.promoCode);
    if (!promo) throw new OrderError("Печать промокода недействительна", 422);
  }

  const totals = calculateTotals(lines, input.shippingMethod, promo);
  const c = input.contact;

  const order = await prisma.order.create({
    data: {
      accessToken: randomBytes(24).toString("base64url"),
      email: c.email,
      phone: c.phone,
      name: c.name,
      country: c.country,
      city: c.city,
      postalCode: c.postalCode,
      address: c.address,
      shippingMethod: totals.method,
      paymentMethod: input.paymentMethod,
      paymentProvider: provider,
      cryptoCurrency: input.paymentMethod === "CRYPTO" ? (input.cryptoCurrency ?? "BTC") : null,
      promoCode: promo && totals.promoApplied ? promo.code : null,
      subtotal: totals.subtotal / 100,
      discount: totals.discount / 100,
      shippingCost: totals.shipping / 100,
      total: totals.total / 100,
      note: input.note,
      blessing: BLESSINGS[randomInt(BLESSINGS.length)],
      items: {
        create: lines.map((l) => ({
          productId: l.product.id,
          sku: l.product.sku,
          title: l.product.title,
          type: l.product.type,
          image: l.product.images[0] ?? null,
          price: l.product.price,
          quantity: l.quantity,
        })),
      },
    },
  });

  let next: NextStep = { type: "demo" };
  try {
    if (provider === "stripe") {
      const intent = await createPaymentIntent({ id: order.id, number: order.number, email: order.email, totalCents: totals.total });
      await prisma.order.update({ where: { id: order.id }, data: { paymentRef: intent.id } });
      next = { type: "stripe", clientSecret: intent.client_secret! };
    } else if (provider === "coinbase") {
      const successUrl = `${SITE.url}/checkout/success?order=${order.id}&token=${order.accessToken}`;
      const charge = await createCharge({
        id: order.id,
        number: order.number,
        total: totals.total / 100,
        redirectUrl: successUrl,
        cancelUrl: `${SITE.url}/checkout`,
      });
      await prisma.order.update({ where: { id: order.id }, data: { paymentRef: charge.id } });
      next = { type: "coinbase", hostedUrl: charge.hostedUrl };
    }
  } catch (e) {
    console.error("[payments]", e);
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED", note: "Платёжный шлюз недоступен" } });
    throw new OrderError("Платёжный шлюз не отвечает. Попробуйте ещё раз через минуту", 502);
  }

  return { order, totals, next };
}

/** Идемпотентно переводит заказ в статус «Оплачен». */
export async function markOrderPaid(orderId: string) {
  const { count } = await prisma.order.updateMany({
    where: { id: orderId, status: "PENDING" },
    data: { status: "PAID", paidAt: new Date() },
  });
  if (count === 0) return false;

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return false;
  if (order.promoCode) {
    await prisma.promoCode.updateMany({ where: { code: order.promoCode }, data: { usageCount: { increment: 1 } } });
  }
  await sendOrderPaidEmail({
    id: order.id,
    accessToken: order.accessToken,
    number: order.number,
    email: order.email,
    name: order.name,
    total: Number(order.total),
    blessing: order.blessing,
    items: order.items.map((i) => ({ title: i.title, quantity: i.quantity, price: Number(i.price) })),
  });
  return true;
}

/** Сверяет статус оплаты с провайдером (на случай, если вебхук не дошёл). */
export async function confirmOrderPayment(orderId: string, token: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.accessToken !== token) throw new OrderError("Заказ не найден", 404);
  if (order.status !== "PENDING") return order.status;

  let paid = false;
  if (order.paymentProvider === "demo") paid = getPaymentConfig()[order.paymentMethod === "CARD" ? "card" : "crypto"] === "demo";
  else if (order.paymentProvider === "stripe" && order.paymentRef) paid = await isPaymentIntentPaid(order.paymentRef);
  else if (order.paymentProvider === "coinbase" && order.paymentRef) paid = await isChargePaid(order.paymentRef);

  if (paid) await markOrderPaid(order.id);
  return paid ? "PAID" : order.status;
}

export async function getCustomerOrder(orderId: string, token: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order || order.accessToken !== token) return null;
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    name: order.name,
    email: order.email,
    country: order.country,
    city: order.city,
    shippingMethod: order.shippingMethod,
    paymentMethod: order.paymentMethod,
    paymentProvider: order.paymentProvider,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    blessing: order.blessing,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({ id: i.id, title: i.title, sku: i.sku, image: i.image, price: Number(i.price), quantity: i.quantity })),
  };
}

export type CustomerOrder = NonNullable<Awaited<ReturnType<typeof getCustomerOrder>>>;
