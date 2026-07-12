"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";
import { useLanguage } from "@/store/language";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type MenuItem = {
  id: number; name: string; nameAr: string; description: string | null;
  descriptionAr: string | null; price: number; priceSyp?: number; image: string | null;
  available: boolean; category: { id: number; name: string; nameAr: string };
};
type RelatedItem = {
  id: number; name: string; nameAr: string; description: string | null;
  price: number; priceSyp?: number; image: string | null; available: boolean;
  category: { name: string; nameAr: string };
};

export default function ItemDetailClient({
  item,
  relatedItems,
}: {
  item: MenuItem;
  relatedItems: RelatedItem[];
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { t, lang, dir } = useLanguage();

  const categoryLabel = lang === "ar" ? item.category.nameAr : item.category.name;
  const itemName = lang === "ar" ? item.nameAr : item.name;
  const itemDesc = lang === "ar" ? (item.descriptionAr || item.description) : item.description;
  const otherName = lang === "en" ? item.nameAr : item.name;

  const handleAdd = () => {
    addItem({ id: item.id, name: item.name, nameAr: item.nameAr, price: item.price, priceSyp: item.priceSyp, image: item.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div dir={dir}>
      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-4">
        {categoryLabel}
      </span>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{itemName}</h1>
      <p className="text-lg text-muted-foreground mb-4" dir={lang === "ar" ? "ltr" : "rtl"}>{otherName}</p>
      {itemDesc && (
        <p className="text-muted-foreground leading-relaxed mb-6">{itemDesc}</p>
      )}

      <div className="text-3xl font-bold text-primary mb-6">{formatPrice(item.price, item.priceSyp || 0)}</div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-3 bg-muted rounded-xl px-3 py-2">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-bold text-lg">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={!item.available}
        className={cn(
          "w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
          added
            ? "bg-green-500 text-white"
            : item.available
            ? "bg-primary text-white hover:bg-primary-dark hover:scale-[1.02] shadow-lg shadow-primary/25"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        {added ? (
          <><Check className="w-5 h-5" /> {t("cart.added")}</>
        ) : (
          <><ShoppingBag className="w-5 h-5" /> {t("item.addToCart")} - {formatPrice(item.price * qty, (item.priceSyp || 0) * qty)}</>
        )}
      </button>

      {relatedItems.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t("item.youMightLike")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedItems.map((r) => (
              <Link key={r.id} href={`/menu/${r.id}`}>
                <div className="bg-card rounded-xl border border-border p-3 hover:shadow-md transition-shadow">
                  <div className="aspect-square rounded-lg bg-muted mb-2 flex items-center justify-center text-2xl overflow-hidden">
                    {r.image ? (
                      <Image src={r.image} alt={r.name} fill className="object-cover" sizes="100px" />
                    ) : "🍽️"}
                  </div>
                  <p className="font-medium text-sm truncate">{lang === "ar" ? r.nameAr : r.name}</p>
                  <p className="text-primary font-bold text-sm">{formatPrice(r.price, r.priceSyp || 0)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
