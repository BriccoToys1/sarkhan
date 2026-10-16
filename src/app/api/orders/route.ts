import { clientIp, error, json, parseBody, rateLimit } from "@/lib/api";
import { createOrder, OrderError } from "@/lib/orders";
import { orderSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!rateLimit(`order:${clientIp(request)}`, 10, 10 * 60_000)) return error("Слишком много попыток оформления, подождите немного", 429);
  const body = await parseBody(request, orderSchema);
  if (!body.ok) return body.response;

  try {
    const { order, totals, next } = await createOrder(body.data);
    return json({
      ok: true,
      orderId: order.id,
      token: order.accessToken,
      number: order.number,
      total: totals.total,
      next,
    });
  } catch (e) {
    if (e instanceof OrderError) return error(e.message, e.status);
    console.error("[orders]", e);
    return error("Ритуал прерван. Попробуйте ещё раз", 500);
  }
}
