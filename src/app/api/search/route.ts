import type { NextRequest } from "next/server";
import { json } from "@/lib/api";
import { getProducts } from "@/lib/data";
import { TYPE_LABELS } from "@/lib/labels";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase().slice(0, 80);
  if (q.length < 2) return json({ results: [] });
  const words = q.split(/\s+/).filter(Boolean);
  const results = (await getProducts())
    .map((p) => {
      const hay = [p.title, p.titleEn ?? "", p.sku, p.shortDescription, TYPE_LABELS[p.type], p.collection?.title ?? ""]
        .join(" ")
        .toLowerCase();
      const score = words.reduce((s, w) => s + (hay.includes(w) ? 1 : 0), 0) + (p.title.toLowerCase().includes(q) ? 2 : 0);
      return { p, score };
    })
    .filter((r) => r.score >= words.length)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ p }) => ({ id: p.id, slug: p.slug, title: p.title, price: p.price, image: p.images[0], type: TYPE_LABELS[p.type] }));
  return json({ results });
}
