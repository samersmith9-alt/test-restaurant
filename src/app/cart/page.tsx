"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";
import { useLanguage } from "@/store/language";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const totalSyp = items.reduce((s, i) => s + (i.priceSyp || i.price * 13000) * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <ShoppingBag className="w-20 h-20 text-muted-foreground/30 mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("cart.empty")}</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything yet</p>
        <Link href="/menu" className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all">
          {t("cart.browse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">{t("cart.title")}</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.nameAr}</p>
              <p className="text-primary font-bold mt-1">{formatPrice(item.price, item.priceSyp || 0)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => removeItem(item.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 bg-muted rounded-xl px-2 py-1">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity, (item.priceSyp || item.price * 13000) * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-card rounded-2xl border border-border shadow-sm">
        <div className="flex justify-between items-center text-lg font-bold mb-6">
          <span>{t("cart.total")}</span>
          <span className="text-primary text-2xl">{formatPrice(totalPrice, totalSyp)}</span>
        </div>
        <Link href="/checkout" className="w-full py-3.5 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-dark transition-all hover:scale-[1.02] shadow-lg shadow-primary/25">
          {t("cart.checkout")} <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
