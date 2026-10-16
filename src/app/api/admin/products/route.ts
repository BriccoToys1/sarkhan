import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { bustCache } from "@/lib/admin-cache";
import { serialize, slugify } from "@/lib/admin-serialize";
import { error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  sku: z.string().min(1).max(80),
  slug: z.string().min(1).max(120).optional(),
  title: z.string().min(1).max(200),
  titleEn: z.string().max(200).nullable().optional(),
  type: z.enum(["DECK", "PRINT", "ORIGINAL", "ACCESSORY", "BOOK"]),
  collectionId: z.string().nullable().optional(),
  price: z.number().nonnegative(),
  shortDescription: z.string().min(1).max(500),
  description: z.string().min(1),
  visualDescription: z.string().nullable().optional(),
  specs: z.record(z.string(), z.string()).optional(),
  images: z.array(z.string()).default([]),
  stock: z.number().int().nonnegative().default(0),
  availability: z.enum(["IN_STOCK", "PRE_ORDER", "SOLD_OUT"]).default("IN_STOCK"),
  leadTimeDays: z.number().int().nullable().optional(),
  isLimited: z.boolean().optional(),
  editionSize: z.number().int().nullable().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  sortOrder: z.number().int().optional(),
});

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const rows = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { collection: { select: { id: true, title: true, slug: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(serialize(rows));
}

export async function POST(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const body = await parseBody(req, productSchema);
  if (!body.ok) return body.response;
  const d = body.data;
  const slug = d.slug?.trim() || slugify(d.title);
  try {
    const row = await prisma.product.create({
      data: {
        ...d,
        slug,
        titleEn: d.titleEn ?? null,
        collectionId: d.collectionId || null,
        visualDescription: d.visualDescription ?? null,
        specs: d.specs ?? {},
        leadTimeDays: d.leadTimeDays ?? null,
        editionSize: d.editionSize ?? null,
      },
    });
    bustCache("products", "collections");
    return NextResponse.json(serialize(row), { status: 201 });
  } catch (e) {
    console.error(e);
    return error("Не удалось создать товар (sku/slug уникальны)", 409);
  }
}
