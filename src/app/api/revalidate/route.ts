import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { error, json, parseBody } from "@/lib/api";
import { CACHE_TAGS } from "@/lib/data";

const schema = z.object({
  tags: z.array(z.string().max(120)).min(1).max(20).optional(),
});

function authorized(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!secret || !given) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Сброс кэша витрины. Вызывается панелью администратора после изменений. */
export async function POST(request: Request) {
  if (!authorized(request)) return error("Нет доступа", 401);
  const body = await parseBody(request, schema);
  if (!body.ok) return body.response;
  const tags = body.data.tags ?? [...CACHE_TAGS];
  for (const tag of tags) revalidateTag(tag, "max");
  return json({ ok: true, revalidated: tags });
}
