import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const [newOrders, newContacts, subscribers] = await Promise.all([
    prisma.order.count({ where: { status: { in: ["PENDING", "PAID"] } } }),
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.subscriber.count(),
  ]);

  return NextResponse.json({ newOrders, newContacts, subscribers });
}
