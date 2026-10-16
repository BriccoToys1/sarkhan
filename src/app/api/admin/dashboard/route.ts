import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/admin-serialize";

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const [ordersTotal, ordersPaid, revenue, products, contactsOpen, subscribers, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: ["PAID", "PACKED", "SHIPPED", "DELIVERED"] } } }),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "PACKED", "SHIPPED", "DELIVERED"] } },
        _sum: { total: true },
      }),
      prisma.product.count(),
      prisma.contactMessage.count({ where: { handled: false } }),
      prisma.subscriber.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          number: true,
          name: true,
          email: true,
          total: true,
          currency: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  return NextResponse.json(
    serialize({
      ordersTotal,
      ordersPaid,
      revenue: Number(revenue._sum.total || 0),
      products,
      contactsOpen,
      subscribers,
      recentOrders,
    }),
  );
}
