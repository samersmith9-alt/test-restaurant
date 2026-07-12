"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";
import { useLanguage } from "@/store/language";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateQuantity, removeItem, totalItems } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const totalUsd = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalSyp = items.reduce((s, i) => s + (i.priceSyp || i.price * 13000) * i.quantity, 0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-card z-50 shadow-2xl transform transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-lg">{t("cart.title")} ({totalItems})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/40" />
              <p className="text-muted-foreground">{t("cart.empty")}</p>
              <Link
                href="/menu"
                onClick={onClose}
                className="px-6 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-dark transition-colors"
              >
                {t("cart.browse")}
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl bg-muted/50 animate-fade-in-up"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.nameAr}</p>
                      <p className="text-sm font-bold text-primary mt-1">
                        {formatPrice(item.price * item.quantity, (item.priceSyp || item.price * 13000) * item.quantity)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-4 space-y-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("cart.total")}</span>
                  <span className="text-primary">{formatPrice(totalUsd, totalSyp)}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-border rounded-xl text-center text-sm font-medium hover:bg-muted transition-colors"
                  >
                    {t("cart.viewCart")}
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-center text-sm font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-1"
                  >
                    {t("cart.checkout")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
