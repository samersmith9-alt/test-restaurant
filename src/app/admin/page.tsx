import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Utensils, ListOrdered, DollarSign, FolderOpen } from "lucide-react";

export default async function AdminDashboard() {
  const [menuCount, orderCount, totalRevenue, categoryCount] = await Promise.all([
    prisma.menuItem.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.category.count(),
  ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Menu Items", value: menuCount, icon: Utensils, color: "bg-blue-500", href: "/admin/menu" },
    { label: "Categories", value: categoryCount, icon: FolderOpen, color: "bg-purple-500", href: "/admin/categories" },
    { label: "Total Orders", value: orderCount, icon: ListOrdered, color: "bg-amber-500", href: "/admin/orders" },
    { label: "Revenue", value: `$${totalRevenue._sum.total?.toFixed(2) || "0.00"}`, icon: DollarSign, color: "bg-green-500", href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-muted-foreground text-sm">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Order #</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Customer</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-medium">#{order.id}</td>
                    <td className="py-3 px-2 text-muted-foreground">{order.customerName}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-medium">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
