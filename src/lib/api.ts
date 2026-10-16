import type { ZodType } from "zod";

export function json(data: unknown, init?: number | ResponseInit) {
  return Response.json(data, typeof init === "number" ? { status: init } : init);
}

export function error(message: string, status = 400, extra?: Record<string, unknown>) {
  return Response.json({ ok: false, error: message, ...extra }, { status });
}

export function clientIp(request: Request) {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

export async function parseBody<T>(request: Request, schema: ZodType<T>) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false as const, response: error("Некорректный запрос") };
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0];
    return { ok: false as const, response: error(first?.message ?? "Некорректные данные", 422, { field: first?.path.join(".") }) };
  }
  return { ok: true as const, data: result.data };
}

// Простое ограничение частоты запросов в памяти процесса (один инстанс на VPS).
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.every((t) => now - t > windowMs)) buckets.delete(k);
  }
  return true;
}
