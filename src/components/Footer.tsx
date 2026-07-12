"use client";

import Link from "next/link";
import { useLanguage } from "@/store/language";
import { Globe, MessageCircle, Phone, Mail, MapPin, Clock, Utensils } from "lucide-react";

export default function Footer() {
  const { t, dir } = useLanguage();

  const quickLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/menu", label: t("nav.menu") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
    { href: "/orders", label: t("nav.orders") },
  ];

  return (
    <footer className="bg-[#1a1a2e] text-gray-300 mt-auto" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white">
                Test <span className="text-primary">Restaurant</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">{t("footer.description")}</p>
            <div className="flex gap-3 mt-6">
              {[Globe, MessageCircle, Phone].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.contactInfo")}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>123 Restaurant Street, Damascus, Syria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+963 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>info@testrestaurant.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <div>
                  <p>Sat - Thu: 10:00 AM - 11:00 PM</p>
                  <p>Friday: 1:00 PM - 11:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.newsletter")}</h3>
            <p className="text-sm mb-4">{t("footer.subscribe")}</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
              >
                {t("footer.subscribeBtn")}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Test Restaurant. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
