"use client";

import { useState } from "react";

type OrderItem = { id: number; quantity: number; price: number; menuItem: { name: string } };
type Order = {
  id: number; customerName: string; customerPhone: string; address: string;
  notes: string | null; total: number; status: string; createdAt: string; items: OrderItem[];
};

const statuses = ["pending", "preparing", "ready", "delivered"];

export default function AdminOrdersClient({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState("all");
  const [localOrders, setLocalOrders] = useState(orders);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/orders?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLocalOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const filtered = filter === "all" ? localOrders : localOrders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Orders Management</h1>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === s
                ? "bg-primary text-white"
                : "bg-card border border-border hover:bg-muted"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="bg-card rounded-xl border border-border p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <p className="font-semibold text-foreground">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customerName} • {order.customerPhone}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()} • {order.address}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-primary text-lg">${order.total.toFixed(2)}</p>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {order.notes && (
              <p className="text-sm text-muted-foreground mb-3">
                <span className="font-medium">Notes:</span> {order.notes}
              </p>
            )}
            <div className="border-t border-border pt-3 space-y-1">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.menuItem.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-10">No orders found</p>
        )}
      </div>
    </div>
  );
}
