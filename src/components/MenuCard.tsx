"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";
import { useLanguage } from "@/store/language";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type MenuCardProps = {
  id: number;
  name: string;
  nameAr: string;
  description?: string | null;
  descriptionAr?: string | null;
  price: number;
  priceSyp?: number;
  image: string | null;
  categoryName?: string;
  categoryNameAr?: string;
  available?: boolean;
};

export default function MenuCard({
  id,
  name,
  nameAr,
  description,
  descriptionAr,
  price,
  priceSyp = 0,
  image,
  categoryName,
  categoryNameAr,
  available = true,
}: MenuCardProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { t, lang, dir } = useLanguage();
  const [added, setAdded] = useState(false);

  const currentName = lang === "ar" ? nameAr : name;
  const currentDesc = lang === "ar" ? (descriptionAr || description) : description;
  const currentCat = lang === "ar" ? (categoryNameAr || categoryName) : categoryName;

  const handleAdd = () => {
    if (!available) return;
    addItem({ id, name, nameAr, price, image: image || null });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className={cn(
        "group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300",
        "hover:-translate-y-1"
      )}
    >
      <Link href={`/menu/${id}`} className="block relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={currentName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {currentCat && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-[#1a1a2e]/90 text-xs font-medium rounded-full backdrop-blur-sm">
            {currentCat}
          </span>
        )}
        {!available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{t("item.unavailable")}</span>
          </div>
        )}
      </Link>
      <div className="p-4" dir={dir}>
        <h3 className="font-semibold text-foreground truncate">{currentName}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{lang === "en" ? nameAr : name}</p>
        {currentDesc && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{currentDesc}</p>
        )}
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-primary">{formatPrice(price, priceSyp)}</span>
          <button
            onClick={handleAdd}
            disabled={!available}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
              added
                ? "bg-green-500 text-white scale-110"
                : available
                ? "bg-primary text-white hover:bg-primary-dark hover:scale-105"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
