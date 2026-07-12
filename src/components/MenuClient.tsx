"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/store/language";
import MenuCard from "@/components/MenuCard";

type Category = { id: number; name: string; nameAr: string; slug: string };
type MenuItem = {
  id: number; name: string; nameAr: string; description: string | null;
  descriptionAr: string | null; price: number; priceSyp?: number; image: string | null; available: boolean;
  category: { id: number; name: string; nameAr: string };
};

export default function MenuClient({ items, categories }: { items: MenuItem[]; categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const { t, lang } = useLanguage();

  const filtered = useMemo(() => {
    let result = items;
    if (activeCategory) result = result.filter((i) => i.category.id === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.nameAr.includes(q) ||
          (i.description?.toLowerCase().includes(q))
      );
    }
    return result;
  }, [items, activeCategory, search]);

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">{t("menu.title")}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t("menu.description")}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("menu.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            !activeCategory
              ? "bg-primary text-white shadow-md shadow-primary/25"
              : "bg-card border border-border hover:bg-muted"
          }`}
        >
          {t("menu.all")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "bg-card border border-border hover:bg-muted"
            }`}
          >
            {lang === "ar" ? cat.nameAr : cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-muted-foreground">{t("menu.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item, i) => (
            <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <MenuCard
                id={item.id}
                name={item.name}
                nameAr={item.nameAr}
                description={item.description}
                descriptionAr={item.descriptionAr}
                price={item.price}
                priceSyp={item.priceSyp}
                image={item.image}
                categoryName={item.category.name}
                categoryNameAr={item.category.nameAr}
                available={item.available}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
