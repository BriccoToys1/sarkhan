import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { bustCache } from "@/lib/admin-cache";
import { serialize } from "@/lib/admin-serialize";
import { error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  numeral: z.string().min(1).max(40),
  name: z.string().min(1).max(120),
  keyword: z.string().min(1).max(120),
  interpretation: z.string().min(1),
  image: z.string().min(1),
  productId: z.string().nullable().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const rows = await prisma.oracleCard.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(serialize(rows));
}

export async function POST(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  const row = await prisma.oracleCard.create({
    data: { ...body.data, productId: body.data.productId || null },
  });
  bustCache("oracle");
  return NextResponse.json(serialize(row), { status: 201 });
}
