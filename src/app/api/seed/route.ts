import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const existing = await prisma.admin.findUnique({ where: { username: "admin" } });
  if (!existing) {
    await prisma.admin.create({
      data: {
        username: "admin",
        password: await bcrypt.hash("admin123", 10),
      },
    });
  }

  const catCount = await prisma.category.count();
  if (catCount === 0) {
    const categories = await Promise.all([
      prisma.category.create({
        data: { name: "Grill", nameAr: "مشاوي", slug: "grill", order: 1 },
      }),
      prisma.category.create({
        data: { name: "Appetizers", nameAr: "مقبلات", slug: "appetizers", order: 2 },
      }),
      prisma.category.create({
        data: { name: "Drinks", nameAr: "مشروبات", slug: "drinks", order: 3 },
      }),
      prisma.category.create({
        data: { name: "Desserts", nameAr: "حلويات", slug: "desserts", order: 4 },
      }),
    ]);

    const grillId = categories[0].id;
    const appsId = categories[1].id;
    const drinksId = categories[2].id;
    const dessertsId = categories[3].id;

    await prisma.menuItem.createMany({
      data: [
        { name: "Mixed Grill", nameAr: "مشاوي مشكلة", description: "Tender grilled meat, chicken, and kofta", descriptionAr: "لحم مشوي ودجاج و كفتة", price: 25, priceSyp: 325000, categoryId: grillId, featured: true },
        { name: "Chicken Shawarma", nameAr: "شاورما دجاج", description: "Marinated chicken with garlic sauce", descriptionAr: "دجاج متبل مع صلصة ثوم", price: 12, priceSyp: 156000, categoryId: grillId, featured: true },
        { name: "Lamb Chops", nameAr: "أضلاع خروف", description: "Juicy grilled lamb chops", descriptionAr: "أضلاع خروف مشوية", price: 30, priceSyp: 390000, categoryId: grillId },
        { name: "Hummus", nameAr: "حمص", description: "Creamy chickpea dip with tahini", descriptionAr: "حمص بالطحينة", price: 5, priceSyp: 65000, categoryId: appsId },
        { name: "Falafel Plate", nameAr: "طبق فلافل", description: "Crispy falafel with fresh salad", descriptionAr: "فلافل مقرمشة مع سلطة", price: 7, priceSyp: 91000, categoryId: appsId, featured: true },
        { name: "Stuffed Grape Leaves", nameAr: "ورق عنب", description: "Rice and herbs wrapped in vine leaves", descriptionAr: "ورق عنب محشي أرز وأعشاب", price: 8, priceSyp: 104000, categoryId: appsId },
        { name: "Fresh Lemon Mint", nameAr: "ليمون بالنعناع", description: "Fresh lemonade with mint leaves", descriptionAr: "ليمون طازج مع نعناع", price: 4, priceSyp: 52000, categoryId: drinksId, featured: true },
        { name: "Arabic Coffee", nameAr: "قهوة عربية", description: "Traditional Arabic coffee with cardamom", descriptionAr: "قهوة عربية مع هيل", price: 3, priceSyp: 39000, categoryId: drinksId },
        { name: "Fruit Cocktail", nameAr: "كوكتيلي فواكه", description: "Fresh seasonal fruit mix", descriptionAr: "مزيج فواكه طازجة", price: 6, priceSyp: 78000, categoryId: drinksId },
        { name: "Baklava", nameAr: "بقلاوة", description: "Layered pastry with nuts and honey", descriptionAr: "عجينة طبقات مع مكسرات وعسل", price: 7, priceSyp: 91000, categoryId: dessertsId, featured: true },
        { name: "Kunafa", nameAr: "كنافة", description: "Shredded pastry with cheese and syrup", descriptionAr: "عجينة مبرومة مع جبن وقطر", price: 8, priceSyp: 104000, categoryId: dessertsId },
        { name: "Rice Pudding", nameAr: "أرز بالحليب", description: "Creamy rice pudding with cinnamon", descriptionAr: "أرز بالحليب مع قرفة", price: 5, priceSyp: 65000, categoryId: dessertsId },
      ],
    });
  }

  const missingSyp = await prisma.menuItem.findMany({ where: { priceSyp: 0 } });
  if (missingSyp.length > 0) {
    const sypPrices: Record<number, number> = {
      25: 325000, 12: 156000, 30: 390000, 5: 65000, 7: 91000, 8: 104000, 4: 52000, 3: 39000, 6: 78000,
    };
    for (const item of missingSyp) {
      const syp = sypPrices[item.price];
      if (syp) {
        await prisma.menuItem.update({ where: { id: item.id }, data: { priceSyp: syp } });
      }
    }
  }

  return Response.json({ success: true, message: "Database seeded!" });
}
