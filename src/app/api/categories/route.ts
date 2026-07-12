import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { menuItems: true } } },
  });
  return Response.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const category = await prisma.category.create({ data: body });
  return Response.json(category, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const body = await request.json();
  const category = await prisma.category.update({
    where: { id: Number(id) },
    data: body,
  });
  return Response.json(category);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  await prisma.category.delete({ where: { id: Number(id) } });
  return Response.json({ success: true });
}
