import { prisma } from "@/lib/prisma";
import MenuClient from "@/components/MenuClient";

export default async function MenuPage() {
  const [items, categories] = await Promise.all([
    prisma.menuItem.findMany({
      where: { available: true },
      include: { category: true },
      orderBy: { categoryId: "asc" },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <MenuClient
        items={JSON.parse(JSON.stringify(items))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  );
}
