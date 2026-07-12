import { prisma } from "@/lib/prisma";
import AdminMenuClient from "@/components/AdminMenuClient";

export default async function AdminMenuPage() {
  const [items, categories] = await Promise.all([
    prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <AdminMenuClient
      items={JSON.parse(JSON.stringify(items))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
