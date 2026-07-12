"use client";

import { useLanguage } from "@/store/language";
import { Utensils, Users, Award, Heart } from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  const stats = [
    { icon: Utensils, value: "15+", label: t("about.years") },
    { icon: Users, value: "50K+", label: t("about.customers") },
    { icon: Award, value: "200+", label: t("about.items") },
    { icon: Heart, value: "4.9", label: t("about.rating") },
  ];

  const values = [
    { title: t("about.fresh"), desc: t("about.freshDesc"), emoji: "🥬" },
    { title: t("about.authentic"), desc: t("about.authenticDesc"), emoji: "👨‍🍳" },
    { title: t("about.service"), desc: t("about.serviceDesc"), emoji: "🤝" },
  ];

  return (
    <div className="pt-24">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("about.title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("about.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">🍽️</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("about.story")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{t("about.story1")}</p>
            <p className="text-muted-foreground leading-relaxed">{t("about.story2")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center p-6 bg-card rounded-2xl border border-border shadow-sm">
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div key={v.title} className="text-center p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <span className="text-5xl block mb-4">{v.emoji}</span>
              <h3 className="text-xl font-bold text-foreground mb-3">{v.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
