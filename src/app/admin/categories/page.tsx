import { prisma } from "@/lib/prisma";
import AdminCategoriesClient from "@/components/AdminCategoriesClient";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { menuItems: true } } },
  });

  return <AdminCategoriesClient categories={JSON.parse(JSON.stringify(categories))} />;
}
