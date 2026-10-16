import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { serialize } from "@/lib/admin-serialize";
import { error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  code: z.string().min(1).max(40).optional(),
  description: z.string().nullable().optional(),
  type: z.enum(["PERCENT", "FREE_SHIPPING"]).optional(),
  value: z.number().nonnegative().optional(),
  minSubtotal: z.number().nonnegative().nullable().optional(),
  excludeOriginals: z.boolean().optional(),
  active: z.boolean().optional(),
  validUntil: z.string().datetime().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  const { validUntil, code, ...rest } = body.data;
  try {
    const row = await prisma.promoCode.update({
      where: { id },
      data: {
        ...rest,
        ...(code ? { code: code.trim().toUpperCase() } : {}),
        ...(validUntil !== undefined ? { validUntil: validUntil ? new Date(validUntil) : null } : {}),
      },
    });
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
    await prisma.promoCode.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return error("Не удалось удалить", 400);
  }
}
