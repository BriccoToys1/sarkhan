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
  year: z.number().int().nullable().optional(),
  materials: z.string().min(1),
  dimensions: z.string().nullable().optional(),
  description: z.string().min(1),
  image: z.string().min(1),
  imageHiRes: z.string().nullable().optional(),
  audioUrl: z.string().nullable().optional(),
  audioTranscript: z.string().nullable().optional(),
  productId: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
});

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const rows = await prisma.artwork.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(serialize(rows));
}

export async function POST(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  const d = body.data;
  try {
    const row = await prisma.artwork.create({
      data: {
        ...d,
        slug: d.slug?.trim() || slugify(d.title),
        year: d.year ?? null,
        dimensions: d.dimensions ?? null,
        imageHiRes: d.imageHiRes ?? null,
        audioUrl: d.audioUrl ?? null,
        audioTranscript: d.audioTranscript ?? null,
        productId: d.productId || null,
      },
    });
    bustCache("gallery");
    return NextResponse.json(serialize(row), { status: 201 });
  } catch {
    return error("Не удалось создать", 409);
  }
}
