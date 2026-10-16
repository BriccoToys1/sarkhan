/** Convert Prisma Decimal / Date for JSON responses. */
export function serialize<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_k, v) => {
      if (v !== null && typeof v === "object" && typeof (v as { toFixed?: unknown }).toFixed === "function") {
        return Number(v);
      }
      if (v instanceof Date) return v.toISOString();
      return v;
    }),
  ) as T;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
