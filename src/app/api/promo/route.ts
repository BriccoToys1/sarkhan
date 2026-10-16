import { clientIp, error, json, parseBody, rateLimit } from "@/lib/api";
import { findPromo } from "@/lib/orders";
import { promoSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!rateLimit(`promo:${clientIp(request)}`, 15, 60_000)) return error("Слишком много попыток", 429);
  const body = await parseBody(request, promoSchema);
  if (!body.ok) return error("Введите промокод", 422);
  const promo = await findPromo(body.data.code);
  if (!promo) return error("Печать недействительна", 404);
  return json({ ok: true, promo });
}
