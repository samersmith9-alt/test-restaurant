"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { useLanguage } from "@/store/language";
import { useCurrency } from "@/store/currency";
import { Menu, X, ShoppingBag, Utensils, Languages, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar({ onCartOpen }: { onCartOpen?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { t, lang, setLang, dir } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/menu", label: t("nav.menu") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-[#0f0f1a]/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-foreground">
            Test <span className="text-primary">Restaurant</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors relative group py-2"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrency(currency === "USD" ? "SYP" : "USD")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
            title={currency === "USD" ? "SYP" : "USD"}
          >
            <DollarSign className="w-4 h-4" />
            <span className="sr-only">{currency}</span>
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle language"
          >
            <Languages className="w-4 h-4" />
          </button>
          <button
            onClick={onCartOpen}
            className="relative p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold animate-fade-in-up">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-[#0f0f1a] border-t border-border animate-fade-in-up">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 px-4 pt-2">
              <button
                onClick={() => setCurrency(currency === "USD" ? "SYP" : "USD")}
                className="flex-1 px-3 py-2 rounded-lg text-sm border border-border hover:bg-muted transition-colors"
              >
                {currency === "USD" ? "SYP 🇸🇾" : "USD 💵"}
              </button>
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="flex-1 px-3 py-2 rounded-lg text-sm border border-border hover:bg-muted transition-colors"
              >
                {lang === "en" ? "العربية" : "English"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
