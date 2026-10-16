import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { bustCache } from "@/lib/admin-cache";
import { serialize } from "@/lib/admin-serialize";
import { error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  numeral: z.string().min(1).max(40).optional(),
  name: z.string().min(1).max(120).optional(),
  keyword: z.string().min(1).max(120).optional(),
  interpretation: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  productId: z.string().nullable().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  try {
    const row = await prisma.oracleCard.update({ where: { id }, data: body.data });
    bustCache("oracle");
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
    await prisma.oracleCard.delete({ where: { id } });
    bustCache("oracle");
    return NextResponse.json({ ok: true });
  } catch {
    return error("Не удалось удалить", 400);
  }
}
