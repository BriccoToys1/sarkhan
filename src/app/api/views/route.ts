import { z } from "zod";
import { clientIp, json, parseBody, rateLimit } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const schema = z.object({ kind: z.enum(["product", "artwork"]), id: z.string().min(1).max(64) });

/** Счётчик просмотров для аналитики панели администратора. */
export async function POST(request: Request) {
  const body = await parseBody(request, schema);
  if (!body.ok) return json({ ok: false });
  const { kind, id } = body.data;
  if (!rateLimit(`view:${clientIp(request)}:${kind}:${id}`, 1, 30 * 60_000)) return json({ ok: true });
  const where = { id };
  const data = { views: { increment: 1 } };
  if (kind === "product") await prisma.product.updateMany({ where, data });
  else await prisma.artwork.updateMany({ where, data });
  return json({ ok: true });
}
