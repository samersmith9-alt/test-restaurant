import { prisma } from "@/lib/prisma";
import AdminOrdersClient from "@/components/AdminOrdersClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: "desc" },
  });

  return <AdminOrdersClient orders={JSON.parse(JSON.stringify(orders))} />;
}
