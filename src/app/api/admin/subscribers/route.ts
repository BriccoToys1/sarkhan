import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { serialize } from "@/lib/admin-serialize";
import { error } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(serialize(rows));
}

export async function DELETE(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return error("id required", 400);
  try {
    await prisma.subscriber.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return error("Не удалось удалить", 400);
  }
}
