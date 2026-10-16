import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { serialize } from "@/lib/admin-serialize";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(serialize(rows));
}
