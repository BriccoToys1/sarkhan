import { error, json, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { cartSyncSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await parseBody(request, cartSyncSchema);
  if (!body.ok) return error("Некорректная корзина", 422);
  const rows = await prisma.product.findMany({
    where: { id: { in: body.data.ids }, status: "PUBLISHED" },
    select: { id: true, slug: true, title: true, price: true, images: true, stock: true, availability: true, type: true },
  });
  const products = rows.map((p) => ({ ...p, price: Number(p.price), image: p.images[0] ?? null, images: undefined }));
  return json({ ok: true, products });
}
