import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { bustCache } from "@/lib/admin-cache";
import { serialize } from "@/lib/admin-serialize";
import { error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  sku: z.string().min(1).max(80).optional(),
  slug: z.string().min(1).max(120).optional(),
  title: z.string().min(1).max(200).optional(),
  titleEn: z.string().max(200).nullable().optional(),
  type: z.enum(["DECK", "PRINT", "ORIGINAL", "ACCESSORY", "BOOK"]).optional(),
  collectionId: z.string().nullable().optional(),
  price: z.number().nonnegative().optional(),
  shortDescription: z.string().min(1).max(500).optional(),
  description: z.string().min(1).optional(),
  visualDescription: z.string().nullable().optional(),
  specs: z.record(z.string(), z.string()).optional(),
  images: z.array(z.string()).optional(),
  stock: z.number().int().nonnegative().optional(),
  availability: z.enum(["IN_STOCK", "PRE_ORDER", "SOLD_OUT"]).optional(),
  leadTimeDays: z.number().int().nullable().optional(),
  isLimited: z.boolean().optional(),
  editionSize: z.number().int().nullable().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  sortOrder: z.number().int().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const row = await prisma.product.findUnique({
    where: { id },
    include: { collection: { select: { id: true, title: true } } },
  });
  if (!row) return error("Не найдено", 404);
  return NextResponse.json(serialize(row));
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await parseBody(req, patchSchema);
  if (!body.ok) return body.response;
  try {
    const row = await prisma.product.update({ where: { id }, data: body.data });
    bustCache("products", "collections");
    return NextResponse.json(serialize(row));
  } catch {
    return error("Не удалось обновить", 400);
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    await prisma.product.delete({ where: { id } });
    bustCache("products", "collections");
    return NextResponse.json({ ok: true });
  } catch {
    return error("Не удалось удалить", 400);
  }
}
