import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { getPgPoolConfig } from "../src/lib/pg-pool";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL required for seeding");

const pool = new Pool(getPgPoolConfig(connectionString));
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/** Remove duplicate rows left by non-idempotent seed runs (keeps oldest per key). */
async function dedupeSeedData() {
  await prisma.$executeRaw`
    DELETE FROM "BusinessService" a
    USING "BusinessService" b
    WHERE a.id > b.id
      AND a."businessId" = b."businessId"
      AND a.name = b.name
  `;
  await prisma.$executeRaw`
    DELETE FROM "BusinessProduct" a
    USING "BusinessProduct" b
    WHERE a.id > b.id
      AND a."businessId" = b."businessId"
      AND a.name = b.name
  `;
  await prisma.$executeRaw`
    DELETE FROM "Category" a
    USING "Category" b
    WHERE a.id > b.id
      AND a."businessId" = b."businessId"
      AND a.slug = b.slug
  `;
  await prisma.$executeRaw`
    DELETE FROM "FoundationProject" a
    USING "FoundationProject" b
    WHERE a.id > b.id
      AND a."businessId" = b."businessId"
      AND a.title = b.title
  `;
  await prisma.$executeRaw`
    DELETE FROM "Review" a
    USING "Review" b
    WHERE a.id > b.id
      AND a."businessId" = b."businessId"
      AND a.comment = b.comment
  `;
}

async function main() {
  await dedupeSeedData();

  const adminPassword = await bcrypt.hash("admin123", 12);

  await prisma.admin.upsert({
    where: { email: "admin@jbrand.com" },
    update: {},
    create: {
      email: "admin@jbrand.com",
      password: adminPassword,
      name: "J Admin",
      role: "superadmin",
    },
  });

  const impactStats = [
    { key: "people_helped", label: "People Helped", value: 12500, icon: "users" },
    { key: "projects_completed", label: "Projects Completed", value: 48, icon: "folder" },
    { key: "meals_provided", label: "Meals Provided", value: 85000, icon: "utensils" },
    { key: "students_supported", label: "Students Supported", value: 320, icon: "graduation-cap" },
  ];

  for (const stat of impactStats) {
    await prisma.impactStat.upsert({
      where: { key: stat.key },
      update: { value: stat.value, label: stat.label },
      create: stat,
    });
  }

  const settings = [
    { key: "site_name", value: "J" },
    { key: "site_url", value: "https://jgroup.space" },
    { key: "tagline", value: "One Vision. Many Possibilities." },
    { key: "phone", value: "+91 98765 43210" },
    { key: "whatsapp", value: "+919876543210" },
    { key: "email", value: "hello@jbrand.com" },
    { key: "location", value: "Hyderabad, Telangana, India" },
    { key: "instagram", value: "https://instagram.com/jbrand" },
    { key: "facebook", value: "https://facebook.com/jbrand" },
    { key: "youtube", value: "https://youtube.com/jbrand" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // J Surprise Events
  const eventsBusiness = await prisma.business.upsert({
    where: { slug: "j-surprise-events" },
    update: {},
    create: {
      name: "J Surprise Events",
      slug: "j-surprise-events",
      description: "We create moments you'll never forget.",
      tagline: "We Turn Moments Into Memories.",
      category: "events",
      route: "/j-surprise-events",
      status: "active",
      sortOrder: 1,
      featured: true,
      heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
      theme: {
        create: {
          primaryColor: "#C084FC",
          secondaryColor: "#F472B6",
          accentColor: "#FBBF24",
          environment3d: "celebration",
          fontFamily: "Playfair Display",
          particleType: "confetti",
        },
      },
    },
    include: { theme: true },
  });

  const eventServices = [
    { name: "Birthday Decorations", description: "Magical birthday setups that surprise and delight", price: 4999, category: "birthday", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80" },
    { name: "Surprise Proposals", description: "Romantic setups for the perfect 'yes'", price: 14999, category: "proposal", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
    { name: "Anniversary Celebrations", description: "Celebrate love with elegant decorations", price: 7999, category: "anniversary", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80" },
    { name: "Wedding Events", description: "Complete wedding decoration and planning", price: 49999, category: "wedding", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
    { name: "Baby Celebrations", description: "Welcome the little one with joy", price: 5999, category: "baby", image: "https://images.unsplash.com/photo-1515488042361-ee00e3ddd4e4?w=600&q=80" },
    { name: "Corporate Events", description: "Professional event management for businesses", price: 24999, category: "corporate", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" },
    { name: "Flash Mobs", description: "Surprise performances that create memories", price: 19999, category: "flashmob", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80" },
    { name: "Custom Events", description: "Tell us your dream, we'll make it happen", price: 0, category: "custom", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80" },
  ];

  for (const [i, svc] of eventServices.entries()) {
    const existing = await prisma.businessService.findFirst({
      where: { businessId: eventsBusiness.id, name: svc.name },
    });
    if (existing) {
      await prisma.businessService.update({
        where: { id: existing.id },
        data: { ...svc, sortOrder: i, featured: i < 3 },
      });
    } else {
      await prisma.businessService.create({
        data: { businessId: eventsBusiness.id, ...svc, sortOrder: i, featured: i < 3 },
      });
    }
  }

  // J Foods
  const foodsBusiness = await prisma.business.upsert({
    where: { slug: "j-foods" },
    update: {},
    create: {
      name: "J Foods",
      slug: "j-foods",
      description: "Authentic Indian & Andhra food made for everyday meals, celebrations and unforgettable gatherings.",
      tagline: "Taste the Tradition.",
      category: "food",
      route: "/j-foods",
      status: "active",
      sortOrder: 2,
      featured: true,
      heroImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&q=80",
      theme: {
        create: {
          primaryColor: "#166534",
          secondaryColor: "#FEF3C7",
          accentColor: "#D97706",
          environment3d: "food",
          fontFamily: "Cormorant Garamond",
          particleType: "steam",
        },
      },
    },
  });

  const foodCategories = [
    { name: "Biryani", slug: "biryani" },
    { name: "Meals", slug: "meals" },
    { name: "Combos", slug: "combos" },
    { name: "Student Zone", slug: "student-zone" },
    { name: "Family Packs", slug: "family-packs" },
    { name: "Party Packs", slug: "party-packs" },
    { name: "Catering", slug: "catering" },
  ];

  const categoryMap: Record<string, string> = {};
  for (const [i, cat] of foodCategories.entries()) {
    const existing = await prisma.category.findFirst({
      where: { businessId: foodsBusiness.id, slug: cat.slug },
    });
    const category =
      existing ??
      (await prisma.category.create({
        data: { businessId: foodsBusiness.id, ...cat, sortOrder: i },
      }));
    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: { name: cat.name, sortOrder: i },
      });
    }
    categoryMap[cat.slug] = category.id;
  }

  const foodProducts = [
    { name: "Hyderabadi Chicken Biryani", description: "Aromatic basmati rice with tender chicken", price: 249, categoryId: categoryMap["biryani"], image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80", isFeatured: true },
    { name: "Andhra Veg Meals", description: "Traditional thali with 8 items", price: 149, categoryId: categoryMap["meals"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80", isFeatured: true },
    { name: "Family Biryani Pack", description: "Serves 4 — perfect for family dinners", price: 799, categoryId: categoryMap["family-packs"], image: "https://images.unsplash.com/photo-1633945274405-2a0e6b4e0b0e?w=600&q=80", isCombo: true },
    { name: "Student Veg Meal", description: "Filling meal at student-friendly price", price: 79, categoryId: categoryMap["student-zone"], image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80", isStudent: true, isFeatured: true },
    { name: "Student Biryani Combo", description: "Biryani + Raita + Drink", price: 129, categoryId: categoryMap["student-zone"], image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80", isStudent: true },
    { name: "Hostel Special Thali", description: "Budget thali for hostel students", price: 89, categoryId: categoryMap["student-zone"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80", isStudent: true },
    { name: "Group Combo (5 People)", description: "5 biryanis + sides + dessert", price: 999, categoryId: categoryMap["combos"], image: "https://images.unsplash.com/photo-1633945274405-2a0e6b4e0b0e?w=600&q=80", isCombo: true },
    { name: "Party Pack (10 People)", description: "Complete party catering pack", price: 2499, categoryId: categoryMap["party-packs"], image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80", isCombo: true },
    { name: "Wedding Catering (per plate)", description: "Premium wedding buffet", price: 399, categoryId: categoryMap["catering"], image: "https://images.unsplash.com/photo-1555244160-5904fc4c4b0a?w=600&q=80" },
    { name: "Mutton Biryani", description: "Rich and flavorful mutton biryani", price: 299, categoryId: categoryMap["biryani"], image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80" },
  ];

  for (const [i, product] of foodProducts.entries()) {
    const existing = await prisma.businessProduct.findFirst({
      where: { businessId: foodsBusiness.id, name: product.name },
    });
    if (existing) {
      await prisma.businessProduct.update({
        where: { id: existing.id },
        data: { ...product, sortOrder: i },
      });
    } else {
      await prisma.businessProduct.create({
        data: { businessId: foodsBusiness.id, ...product, sortOrder: i },
      });
    }
  }

  // J Foundation
  const foundationBusiness = await prisma.business.upsert({
    where: { slug: "j-foundation" },
    update: {},
    create: {
      name: "J Foundation",
      slug: "j-foundation",
      description: "Creating impact beyond business.",
      tagline: "Building a Better Tomorrow.",
      category: "foundation",
      route: "/j-foundation",
      status: "active",
      sortOrder: 3,
      featured: true,
      heroImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
      theme: {
        create: {
          primaryColor: "#1E40AF",
          secondaryColor: "#F0F9FF",
          accentColor: "#059669",
          environment3d: "community",
          fontFamily: "Source Sans 3",
          particleType: "light",
        },
      },
    },
  });

  const foundationProjects = [
    { title: "Education for All", description: "Providing school supplies and scholarships to underprivileged children", impactCount: 320, image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&q=80" },
    { title: "Community Food Drive", description: "Weekly food distribution to families in need", impactCount: 85000, image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" },
    { title: "Women Empowerment", description: "Skill training and micro-loans for women entrepreneurs", impactCount: 150, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80" },
    { title: "Health Camps", description: "Free health checkups in rural communities", impactCount: 2500, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80" },
  ];

  for (const project of foundationProjects) {
    const existing = await prisma.foundationProject.findFirst({
      where: { businessId: foundationBusiness.id, title: project.title },
    });
    if (existing) {
      await prisma.foundationProject.update({
        where: { id: existing.id },
        data: project,
      });
    } else {
      await prisma.foundationProject.create({
        data: { businessId: foundationBusiness.id, ...project },
      });
    }
  }

  // Sample reviews
  const reviews = [
    { businessId: foodsBusiness.id, rating: 5, comment: "Best biryani in Hyderabad! Authentic taste every time." },
    { businessId: foodsBusiness.id, rating: 5, comment: "Student meals are amazing value. ₹79 for a full thali!" },
    { businessId: eventsBusiness.id, rating: 5, comment: "They made my proposal absolutely magical. She said yes!" },
    { businessId: eventsBusiness.id, rating: 5, comment: "Stunning birthday decoration. Every detail was perfect." },
  ];

  for (const review of reviews) {
    const existing = await prisma.review.findFirst({
      where: { businessId: review.businessId, comment: review.comment },
    });
    if (!existing) {
      await prisma.review.create({ data: review });
    }
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
