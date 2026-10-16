import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "@/lib/admin-auth";
import { bustCache } from "@/lib/admin-cache";
import { serialize } from "@/lib/admin-serialize";
import { error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).max(200),
  city: z.string().min(1).max(120),
  country: z.string().min(1).max(120),
  description: z.string().min(1),
  address: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  latitude: z.number(),
  longitude: z.number(),
  isStudio: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const rows = await prisma.venue.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(serialize(rows));
}

export async function POST(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const body = await parseBody(req, schema);
  if (!body.ok) return body.response;
  const row = await prisma.venue.create({
    data: { ...body.data, address: body.data.address ?? null, url: body.data.url ?? null },
  });
  bustCache("venues");
  return NextResponse.json(serialize(row), { status: 201 });
}
