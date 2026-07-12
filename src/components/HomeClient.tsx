"use client";

import Link from "next/link";
import { useLanguage } from "@/store/language";
import MenuCard from "@/components/MenuCard";

type Category = { id: number; name: string; nameAr: string; slug: string; image: string | null };
type MenuItem = {
  id: number; name: string; nameAr: string; description: string | null;
  descriptionAr: string | null; price: number; priceSyp?: number; image: string | null; available: boolean;
  category: { name: string; nameAr: string };
};

const categoryIcons: Record<string, string> = {
  grill: "🥩", appetizers: "🥗", drinks: "🥤", desserts: "🍰",
};

export default function HomeClient({
  featuredItems,
  categories,
}: {
  featuredItems: MenuItem[];
  categories: Category[];
}) {
  const { t, lang } = useLanguage();

  return (
    <>
      {featuredItems.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t("home.featured")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("home.featuredDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item, i) => (
              <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
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
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {t("home.categories")}
              </h2>
              <p className="text-muted-foreground">{t("home.categoriesDesc")}</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/menu?category=${cat.id}`}
                  className="snap-start shrink-0 flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group min-w-[140px]"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {categoryIcons[cat.slug] || "🍽️"}
                  </span>
                  <span className="font-medium text-sm text-center">{lang === "ar" ? cat.nameAr : cat.name}</span>
                  <span className="text-xs text-muted-foreground">{lang === "en" ? cat.nameAr : cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("home.welcome")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t("home.welcomeDesc")}
            </p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { number: "15+", label: t("home.years") },
                { number: "200+", label: t("home.items") },
                { number: "50K+", label: t("home.customers") },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-primary">{stat.number}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              {t("home.learnMore")}
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl mb-4">🍽️</p>
                <p className="text-muted-foreground font-medium">Test Restaurant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary-dark text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("home.ready")}
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            {t("home.readyDesc")}
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary rounded-full font-bold hover:bg-white/90 transition-all hover:scale-105"
          >
            {t("home.viewMenu")}
          </Link>
        </div>
      </section>
    </>
  );
}
