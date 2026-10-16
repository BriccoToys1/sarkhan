import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { serialize } from "@/lib/admin-serialize";
import { error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const schema = z.object({ handled: z.boolean() });

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  try {
    const row = await prisma.contactMessage.update({ where: { id }, data: { handled: body.data.handled } });
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
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return error("Не удалось удалить", 400);
  }
}
