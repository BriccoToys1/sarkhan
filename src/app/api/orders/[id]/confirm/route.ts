import { error, json, parseBody } from "@/lib/api";
import { confirmOrderPayment, OrderError } from "@/lib/orders";
import { tokenSchema } from "@/lib/validation";

export async function POST(request: Request, ctx: RouteContext<"/api/orders/[id]/confirm">) {
  const { id } = await ctx.params;
  const body = await parseBody(request, tokenSchema);
  if (!body.ok) return error("Нет доступа к заказу", 403);
  try {
    const status = await confirmOrderPayment(id, body.data.token);
    return json({ ok: true, status });
  } catch (e) {
    if (e instanceof OrderError) return error(e.message, e.status);
    console.error("[orders/confirm]", e);
    return error("Не удалось проверить оплату", 500);
  }
}
