import { prisma } from "@/lib/prisma";
import OrdersClient from "@/components/OrdersClient";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Track Orders</h1>
      <OrdersClient orders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
