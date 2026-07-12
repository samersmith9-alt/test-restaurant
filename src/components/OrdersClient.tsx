"use client";

import { useState } from "react";
import { useCurrency } from "@/store/currency";
import { useLanguage } from "@/store/language";
import { ChevronDown, Clock, CheckCircle, CookingPot, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderItem = { id: number; quantity: number; price: number; menuItem: { name: string; nameAr: string } };
type Order = {
  id: number; customerName: string; total: number; status: string;
  createdAt: string; items: OrderItem[];
};

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
    pending: { label: t("orders.pending"), color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
    preparing: { label: t("orders.preparing"), color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: CookingPot },
    ready: { label: t("orders.ready"), color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
    delivered: { label: t("orders.delivered"), color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", icon: Truck },
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">{t("orders.empty")}</div>
      )}
      {orders.map((order) => {
        const status = statusConfig[order.status] || statusConfig.pending;
        const StatusIcon = status.icon;
        return (
          <div key={order.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="w-full p-5 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", status.color)}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} {t("orders.items")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("px-3 py-1 rounded-full text-xs font-medium", status.color)}>
                  {status.label}
                </span>
                <span className="font-bold text-primary">{formatPrice(order.total, order.total * 13000)}</span>
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", expanded === order.id && "rotate-180")} />
              </div>
            </button>
            {expanded === order.id && (
              <div className="px-5 pb-5 border-t border-border pt-4 space-y-2 animate-fade-in-up">
                <p className="text-sm font-medium text-foreground">{t("orders.customer")}: {order.customerName}</p>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                      <span>{item.menuItem.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity, item.price * item.quantity * 13000)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
