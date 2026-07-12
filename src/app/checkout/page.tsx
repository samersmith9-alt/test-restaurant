"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";
import { useLanguage } from "@/store/language";
import { ShoppingBag, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const totalSyp = items.reduce((s, i) => s + (i.priceSyp || i.price * 13000) * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      setError(t("checkout.required"));
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          address: form.address,
          notes: form.notes,
          total: totalPrice,
          items: items.map((i) => ({
            menuItemId: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");
      clearCart();
      setDone(true);
    } catch {
      setError(t("checkout.error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !done) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <ShoppingBag className="w-20 h-20 text-muted-foreground/30 mb-6" />
        <h1 className="text-2xl font-bold mb-2">{t("checkout.empty")}</h1>
        <Link href="/menu" className="mt-4 px-8 py-3 bg-primary text-white rounded-full font-medium">
          {t("cart.browse")}
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t("checkout.success")}</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          {t("checkout.successDesc")}
        </p>
        <div className="flex gap-4">
          <Link href="/orders" className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors">
            {t("checkout.track")}
          </Link>
          <Link href="/menu" className="px-8 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors">
            {t("checkout.orderMore")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">{t("checkout.title")}</h1>
      <div className="grid md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("checkout.name")} *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder={t("checkout.namePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("checkout.phone")} *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder={t("checkout.phonePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("checkout.address")} *</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              rows={3}
              placeholder={t("checkout.addressPlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("checkout.notes")}</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              rows={2}
              placeholder={t("checkout.notesPlaceholder")}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {submitting ? t("checkout.placing") : `${t("checkout.placeOrder")} - ${formatPrice(totalPrice, totalSyp)}`}
          </button>
        </form>

        <div className="md:col-span-2">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">{t("checkout.summary")}</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity, (item.priceSyp || item.price * 13000) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
              <span>{t("cart.total")}</span>
              <span className="text-primary">{formatPrice(totalPrice, totalSyp)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
