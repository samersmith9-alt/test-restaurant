import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ItemDetailClient from "@/components/ItemDetailClient";

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.menuItem.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });

  if (!item) notFound();

  const relatedItems = await prisma.menuItem.findMany({
    where: { categoryId: item.categoryId, id: { not: item.id }, available: true },
    take: 4,
  });

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
          )}
        </div>
        <ItemDetailClient
          item={JSON.parse(JSON.stringify(item))}
          relatedItems={JSON.parse(JSON.stringify(relatedItems))}
        />
      </div>
    </div>
  );
}
