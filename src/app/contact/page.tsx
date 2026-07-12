"use client";

import { useLanguage } from "@/store/language";
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const { t } = useLanguage();

  const contactInfo = [
    { icon: Phone, label: t("contact.phone"), value: "+963 11 234 5678", href: "tel:+963112345678" },
    { icon: Mail, label: t("contact.email"), value: "info@testrestaurant.com", href: "mailto:info@testrestaurant.com" },
    { icon: MapPin, label: t("contact.address"), value: "123 Restaurant Street, Damascus, Syria" },
    {
      icon: Clock,
      label: t("contact.hours"),
      value: "Sat-Thu: 10:00 AM - 11:00 PM\nFri: 1:00 PM - 11:00 PM",
    },
  ];

  return (
    <div className="pt-24">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("contact.title")}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("contact.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="font-medium text-foreground hover:text-primary transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-medium text-foreground whitespace-pre-line">{info.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="flex gap-3 pt-4">
              {[Globe, MessageCircle, Phone].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">{t("contact.send")}</h2>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder={t("contact.name")} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input type="email" placeholder={t("contact.emailPlaceholder")} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <input type="text" placeholder={t("contact.subject")} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <textarea rows={5} placeholder={t("contact.message")} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              <button type="submit" className="w-full py-3.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
                {t("contact.sendBtn")}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
