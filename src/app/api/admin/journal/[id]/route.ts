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
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  rubric: z.enum(["SYMBOLISM", "TAROT_HISTORY", "ALCHEMY_ART", "STUDIO_NEWS"]).optional(),
  coverImage: z.string().nullable().optional(),
  author: z.string().optional(),
  readingTime: z.number().int().positive().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  publishedAt: z.string().datetime().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  const { publishedAt, ...rest } = body.data;
  try {
    const row = await prisma.journalPost.update({
      where: { id },
      data: { ...rest, ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}) },
    });
    bustCache("journal");
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
    await prisma.journalPost.delete({ where: { id } });
    bustCache("journal");
    return NextResponse.json({ ok: true });
  } catch {
    return error("Не удалось удалить", 400);
  }
}
