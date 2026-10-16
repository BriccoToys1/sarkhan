import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { bustCache } from "@/lib/admin-cache";
import { serialize } from "@/lib/admin-serialize";
import { error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  slug: z.string().min(1).max(120).optional(),
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(200).nullable().optional(),
  era: z.string().max(120).nullable().optional(),
  excerpt: z.string().min(1).optional(),
  lore: z.string().min(1).optional(),
  coverImage: z.string().min(1).optional(),
  ambientPreset: z.string().optional(),
  ambientUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  try {
    const row = await prisma.collection.update({ where: { id }, data: body.data });
    bustCache("collections");
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
    await prisma.collection.delete({ where: { id } });
    bustCache("collections");
    return NextResponse.json({ ok: true });
  } catch {
    return error("Не удалось удалить", 400);
  }
}
