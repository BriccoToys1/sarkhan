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
  year: z.number().int().nullable().optional(),
  materials: z.string().min(1).optional(),
  dimensions: z.string().nullable().optional(),
  description: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  imageHiRes: z.string().nullable().optional(),
  audioUrl: z.string().nullable().optional(),
  audioTranscript: z.string().nullable().optional(),
  productId: z.string().nullable().optional(),
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
    const row = await prisma.artwork.update({ where: { id }, data: body.data });
    bustCache("gallery");
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
    await prisma.artwork.delete({ where: { id } });
    bustCache("gallery");
    return NextResponse.json({ ok: true });
  } catch {
    return error("Не удалось удалить", 400);
  }
}
