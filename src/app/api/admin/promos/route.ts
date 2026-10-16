import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { serialize } from "@/lib/admin-serialize";
import { error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  code: z.string().min(1).max(40),
  description: z.string().nullable().optional(),
  type: z.enum(["PERCENT", "FREE_SHIPPING"]),
  value: z.number().nonnegative().default(0),
  minSubtotal: z.number().nonnegative().nullable().optional(),
  excludeOriginals: z.boolean().optional(),
  active: z.boolean().optional(),
  validUntil: z.string().datetime().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
});

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const rows = await prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(serialize(rows));
}

export async function POST(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  const d = body.data;
  try {
    const row = await prisma.promoCode.create({
      data: {
        code: d.code.trim().toUpperCase(),
        description: d.description ?? null,
        type: d.type,
        value: d.value,
        minSubtotal: d.minSubtotal ?? null,
        excludeOriginals: d.excludeOriginals ?? false,
        active: d.active ?? true,
        validUntil: d.validUntil ? new Date(d.validUntil) : null,
        usageLimit: d.usageLimit ?? null,
      },
    });
    return NextResponse.json(serialize(row), { status: 201 });
  } catch {
    return error("Код уже существует", 409);
  }
}
