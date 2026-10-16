import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { serialize } from "@/lib/admin-serialize";
import { error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z.enum(["PENDING", "PAID", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  trackingNumber: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const row = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!row) return error("Не найдено", 404);
  return NextResponse.json(serialize(row));
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  try {
    const row = await prisma.order.update({
      where: { id },
      data: body.data,
      include: { items: true },
    });
    return NextResponse.json(serialize(row));
  } catch {
    return error("Не удалось обновить", 400);
  }
}
