"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type Lang = "en" | "ar";

type TranslationValue = string | { en: string; ar: string };

const translations: Record<string, TranslationValue> = {
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.menu": { en: "Menu", ar: "القائمة" },
  "nav.about": { en: "About", ar: "عن المطعم" },
  "nav.contact": { en: "Contact", ar: "اتصل بنا" },
  "nav.orders": { en: "Track Order", ar: "تتبع الطلب" },
  "hero.subtitle": { en: "تذوق أطيب المأكولات", ar: "تذوق أطيب المأكولات" },
  "hero.description": { en: "Experience the finest dining with our carefully crafted menu. Fresh ingredients, authentic flavors, and unforgettable moments.", ar: "استمتع بأرقى تجارب الطعام مع قائمتنا المعدة بعناية. مكونات طازجة، نكهات أصيلة، ولحظات لا تُنسى." },
  "hero.explore": { en: "Explore Our Menu", ar: "استعرض القائمة" },
  "hero.contact": { en: "Contact Us", ar: "اتصل بنا" },
  "hero.open": { en: "Now Open", ar: "مفتوح الآن" },
  "home.featured": { en: "Featured Dishes", ar: "أطباق مميزة" },
  "home.featuredDesc": { en: "Our most popular selections, crafted to perfection", ar: "أكثر اختياراتنا رواجاً، محضرة بإتقان" },
  "home.categories": { en: "Our Categories", ar: "تصنيفاتنا" },
  "home.categoriesDesc": { en: "Browse by category", ar: "تصفح حسب التصنيف" },
  "home.welcome": { en: "Welcome to Test Restaurant", ar: "مرحباً بكم في Test Restaurant" },
  "home.welcomeDesc": { en: "At Test Restaurant, we believe that great food creates unforgettable memories. Our team of passionate chefs uses only the freshest ingredients to bring you authentic flavors from around the world.", ar: "في Test Restaurant، نؤمن بأن الطعام الرائع يصنع ذكريات لا تُنسى. يستخدم فريق الشيفات المتحمسين لدينا فقط المكونات الطازجة ليقدموا لكم النكهات الأصيلة من جميع أنحاء العالم." },
  "home.years": { en: "Years of Excellence", ar: "سنوات من التميز" },
  "home.items": { en: "Menu Items", ar: "صنف في القائمة" },
  "home.customers": { en: "Happy Customers", ar: "زبون سعيد" },
  "home.learnMore": { en: "Learn More", ar: "اعرف المزيد" },
  "home.ready": { en: "Ready to Order?", ar: "مستعد للطلب؟" },
  "home.readyDesc": { en: "Browse our menu and place your order online. Fresh, delicious food delivered to your doorstep.", ar: "تصفح قائمتنا واطلب أونلاين. طعام طازج ولذيذ يوصلك لباب البيت." },
  "home.viewMenu": { en: "View Full Menu", ar: "عرض القائمة كاملة" },
  "menu.title": { en: "Our Menu", ar: "قائمتنا" },
  "menu.description": { en: "Discover our carefully crafted selection of dishes and drinks", ar: "اكتشف مجموعتنا المختارة بعناية من الأطباق والمشروبات" },
  "menu.search": { en: "Search menu...", ar: "ابحث في القائمة..." },
  "menu.all": { en: "All", ar: "الكل" },
  "menu.empty": { en: "No items found", ar: "لا توجد أصناف" },
  "cart.title": { en: "Cart", ar: "السلة" },
  "cart.empty": { en: "Your cart is empty", ar: "سلتك فارغة" },
  "cart.browse": { en: "Browse Menu", ar: "تصفح القائمة" },
  "cart.total": { en: "Total", ar: "المجموع" },
  "cart.viewCart": { en: "View Cart", ar: "عرض السلة" },
  "cart.checkout": { en: "Checkout", ar: "إتمام الطلب" },
  "cart.remove": { en: "Remove", ar: "إزالة" },
  "cart.added": { en: "Added to Cart", ar: "أضيف إلى السلة" },
  "item.addToCart": { en: "Add to Cart", ar: "أضف إلى السلة" },
  "item.youMightLike": { en: "You Might Also Like", ar: "قد يعجبك أيضاً" },
  "item.unavailable": { en: "Unavailable", ar: "غير متوفر" },
  "checkout.title": { en: "Checkout", ar: "إتمام الطلب" },
  "checkout.empty": { en: "Your cart is empty", ar: "سلتك فارغة" },
  "checkout.name": { en: "Full Name", ar: "الاسم الكامل" },
  "checkout.phone": { en: "Phone", ar: "رقم الهاتف" },
  "checkout.address": { en: "Delivery Address", ar: "عنوان التوصيل" },
  "checkout.notes": { en: "Notes", ar: "ملاحظات" },
  "checkout.placeOrder": { en: "Place Order", ar: "تأكيد الطلب" },
  "checkout.placing": { en: "Placing Order...", ar: "جاري تأكيد الطلب..." },
  "checkout.success": { en: "Order Placed Successfully!", ar: "تم تأكيد الطلب بنجاح!" },
  "checkout.successDesc": { en: "Thank you for your order! We'll start preparing it right away.", ar: "شكراً لطلبك! سنبدأ بتحضيره فوراً." },
  "checkout.track": { en: "Track Order", ar: "تتبع الطلب" },
  "checkout.orderMore": { en: "Order More", ar: "طلب المزيد" },
  "checkout.summary": { en: "Order Summary", ar: "ملخص الطلب" },
  "checkout.namePlaceholder": { en: "Your name", ar: "اسمك" },
  "checkout.phonePlaceholder": { en: "+963 9XX XXX XXX", ar: "+963 9XX XXX XXX" },
  "checkout.addressPlaceholder": { en: "Street, building, apartment...", ar: "الشارع، المبنى، رقم الشقة..." },
  "checkout.notesPlaceholder": { en: "Any special requests?", ar: "أي طلبات خاصة؟" },
  "checkout.required": { en: "Please fill in all required fields", ar: "يرجى ملء جميع الحقول المطلوبة" },
  "checkout.error": { en: "Something went wrong. Please try again.", ar: "حدث خطأ. يرجى المحاولة مرة أخرى." },
  "orders.title": { en: "Track Orders", ar: "تتبع الطلبات" },
  "orders.empty": { en: "No orders yet", ar: "لا توجد طلبات بعد" },
  "orders.pending": { en: "Pending", ar: "قيد الانتظار" },
  "orders.preparing": { en: "Preparing", ar: "قيد التحضير" },
  "orders.ready": { en: "Ready", ar: "جاهز" },
  "orders.delivered": { en: "Delivered", ar: "تم التوصيل" },
  "orders.customer": { en: "Customer", ar: "الزبون" },
  "orders.items": { en: "items", ar: "أصناف" },
  "about.title": { en: "About Us", ar: "عن المطعم" },
  "about.description": { en: "At Test Restaurant, we believe that great food creates unforgettable memories.", ar: "في Test Restaurant، نؤمن بأن الطعام الرائع يصنع ذكريات لا تُنسى." },
  "about.story": { en: "Our Story", ar: "قصتنا" },
  "about.story1": { en: "Founded in 2010, Test Restaurant started as a small family-owned establishment with a passion for bringing people together through exceptional food.", ar: "تأسس Test Restaurant في عام 2010 كمطعم عائلي صغير بشغف لجمع الناس معاً من خلال الطعام الاستثنائي." },
  "about.story2": { en: "Our team of talented chefs combines traditional recipes with modern techniques to create dishes that are both familiar and exciting.", ar: "يجمع فريق الشيفات الموهوبين لدينا بين الوصفات التقليدية والتقنيات الحديثة لخلق أطباق مألوفة ومثيرة في آن واحد." },
  "about.years": { en: "Years of Excellence", ar: "سنوات من التميز" },
  "about.customers": { en: "Happy Customers", ar: "زبون سعيد" },
  "about.items": { en: "Menu Items", ar: "صنف في القائمة" },
  "about.rating": { en: "Customer Rating", ar: "تقييم الزبائن" },
  "about.fresh": { en: "Fresh Ingredients", ar: "مكونات طازجة" },
  "about.freshDesc": { en: "We source only the freshest, highest quality ingredients from local suppliers.", ar: "نحن نوفر فقط المكونات الطازجة والأعلى جودة من الموردين المحليين." },
  "about.authentic": { en: "Authentic Flavors", ar: "نكهات أصيلة" },
  "about.authenticDesc": { en: "Our recipes are crafted with care, bringing authentic tastes from around the world.", ar: "وصفاتنا محضرة بعناية، لتقديم نكهات أصيلة من جميع أنحاء العالم." },
  "about.service": { en: "Exceptional Service", ar: "خدمة استثنائية" },
  "about.serviceDesc": { en: "Every guest deserves a memorable dining experience from the moment they walk in.", ar: "كل ضيف يستحق تجربة طعام لا تُنسى من لحظة دخوله." },
  "contact.title": { en: "Contact Us", ar: "اتصل بنا" },
  "contact.description": { en: "We'd love to hear from you. Get in touch with us.", ar: "يسعدنا التواصل معك." },
  "contact.phone": { en: "Phone", ar: "هاتف" },
  "contact.email": { en: "Email", ar: "البريد الإلكتروني" },
  "contact.address": { en: "Address", ar: "العنوان" },
  "contact.hours": { en: "Working Hours", ar: "ساعات العمل" },
  "contact.send": { en: "Send Us a Message", ar: "أرسل لنا رسالة" },
  "contact.name": { en: "Your Name", ar: "اسمك" },
  "contact.emailPlaceholder": { en: "Your Email", ar: "بريدك الإلكتروني" },
  "contact.subject": { en: "Subject", ar: "الموضوع" },
  "contact.message": { en: "Your Message", ar: "رسالتك" },
  "contact.sendBtn": { en: "Send Message", ar: "إرسال" },
  "footer.description": { en: "Experience the finest dining with our carefully crafted menu. Fresh ingredients, authentic flavors, and unforgettable moments.", ar: "استمتع بأرقى تجارب الطعام مع قائمتنا المعدة بعناية. مكونات طازجة، نكهات أصيلة، ولحظات لا تُنسى." },
  "footer.quickLinks": { en: "Quick Links", ar: "روابط سريعة" },
  "footer.contactInfo": { en: "Contact Info", ar: "معلومات الاتصال" },
  "footer.newsletter": { en: "Newsletter", ar: "النشرة البريدية" },
  "footer.subscribe": { en: "Subscribe for special offers and updates.", ar: "اشترك للحصول على عروض وتحديثات خاصة." },
  "footer.subscribeBtn": { en: "Subscribe", ar: "اشتراك" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  "footer.emailPlaceholder": { en: "Your email", ar: "بريدك الإلكتروني" },
  "currency.usd": { en: "USD", ar: "دولار" },
  "currency.syp": { en: "SYP", ar: "ل.س" },
};

type LanguageContextType = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang;
    if (stored === "en" || stored === "ar") {
      setLangState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = useCallback(
    (key: string): string => {
      const val = translations[key];
      if (!val) return key;
      if (typeof val === "string") return val;
      return val[lang] || val.en || key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
