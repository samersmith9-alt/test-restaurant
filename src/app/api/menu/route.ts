import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const where: Record<string, unknown> = {};
  if (category) where.categoryId = Number(category);
  if (featured === "true") where.featured = true;

  const items = await prisma.menuItem.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const item = await prisma.menuItem.create({ data: body });
  return Response.json(item, { status: 201 });
}
