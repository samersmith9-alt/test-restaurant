"use client";

import Link from "next/link";
import { useLanguage } from "@/store/language";

export default function HeroClient() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {t("hero.open")}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Test <span className="text-primary">Restaurant</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-4 font-light" dir="rtl">
          {t("hero.subtitle")}
        </p>
        <p className="text-base text-white/60 mb-10 max-w-2xl mx-auto">
          {t("hero.description")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/menu"
            className="px-8 py-3.5 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all hover:scale-105 shadow-lg shadow-primary/25"
          >
            {t("hero.explore")}
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3.5 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all"
          >
            {t("hero.contact")}
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
