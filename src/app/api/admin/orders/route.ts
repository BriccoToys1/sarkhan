import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { serialize } from "@/lib/admin-serialize";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const status = req.nextUrl.searchParams.get("status");
  const q = req.nextUrl.searchParams.get("q")?.trim();

  const rows = await prisma.order.findMany({
    where: {
      AND: [
        status ? { status: status as never } : {},
        q
          ? {
              OR: [
                { email: { contains: q, mode: "insensitive" } },
                { name: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json(serialize(rows));
}
