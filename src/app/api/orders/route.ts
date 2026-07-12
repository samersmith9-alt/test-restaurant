import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { items, ...orderData } = body;

  const order = await prisma.order.create({
    data: {
      ...orderData,
      items: {
        create: items.map((item: { menuItemId: number; quantity: number; price: number }) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });

  return Response.json(order, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const body = await request.json();
  const order = await prisma.order.update({
    where: { id: Number(id) },
    data: body,
  });
  return Response.json(order);
}
