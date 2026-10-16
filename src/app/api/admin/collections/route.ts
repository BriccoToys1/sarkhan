import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { bustCache } from "@/lib/admin-cache";
import { serialize, slugify } from "@/lib/admin-serialize";
import { error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  slug: z.string().min(1).max(120).optional(),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(200).nullable().optional(),
  era: z.string().max(120).nullable().optional(),
  excerpt: z.string().min(1),
  lore: z.string().min(1),
  coverImage: z.string().min(1),
  ambientPreset: z.string().default("default"),
  ambientUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
});

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const rows = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(serialize(rows));
}

export async function POST(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  const d = body.data;
  try {
    const row = await prisma.collection.create({
      data: {
        ...d,
        slug: d.slug?.trim() || slugify(d.title),
        subtitle: d.subtitle ?? null,
        era: d.era ?? null,
        ambientUrl: d.ambientUrl ?? null,
      },
    });
    bustCache("collections");
    return NextResponse.json(serialize(row), { status: 201 });
  } catch {
    return error("Не удалось создать (slug уникален)", 409);
  }
}
