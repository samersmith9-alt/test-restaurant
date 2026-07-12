import { prisma } from "@/lib/prisma";
import HeroClient from "@/components/HeroClient";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const [featuredItems, categories] = await Promise.all([
    prisma.menuItem.findMany({
      where: { featured: true, available: true },
      include: { category: true },
      take: 6,
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <HeroClient />
      <HomeClient featuredItems={JSON.parse(JSON.stringify(featuredItems))} categories={JSON.parse(JSON.stringify(categories))} />
    </>
  );
}
