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
  excerpt: z.string().min(1),
  content: z.string().min(1),
  rubric: z.enum(["SYMBOLISM", "TAROT_HISTORY", "ALCHEMY_ART", "STUDIO_NEWS"]),
  coverImage: z.string().nullable().optional(),
  author: z.string().optional(),
  readingTime: z.number().int().positive().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  publishedAt: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const rows = await prisma.journalPost.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json(serialize(rows));
}

export async function POST(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  const d = body.data;
  try {
    const row = await prisma.journalPost.create({
      data: {
        ...d,
        slug: d.slug?.trim() || slugify(d.title),
        coverImage: d.coverImage ?? null,
        publishedAt: d.publishedAt ? new Date(d.publishedAt) : undefined,
      },
    });
    bustCache("journal");
    return NextResponse.json(serialize(row), { status: 201 });
  } catch {
    return error("Не удалось создать", 409);
  }
}
