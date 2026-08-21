"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MasterNav } from "@/components/layout/MasterNav";
import { Footer } from "@/components/layout/Footer";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { formatCurrency } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isStudent: boolean;
  isCombo: boolean;
  isFeatured: boolean;
  category: { name: string; slug: string } | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
}

interface BusinessData {
  name: string;
  tagline: string | null;
  description: string;
  heroImage: string | null;
  theme: { primaryColor: string; secondaryColor: string; accentColor: string | null } | null;
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
  reviews: Review[];
}

const CATEGORIES = [
  { emoji: "🍛", label: "Biryani", slug: "biryani" },
  { emoji: "🍗", label: "Chicken", slug: "biryani" },
  { emoji: "🥘", label: "Meals", slug: "meals" },
  { emoji: "🥩", label: "Mutton", slug: "biryani" },
  { emoji: "🐟", label: "Fish", slug: "meals" },
  { emoji: "🥬", label: "Veg", slug: "meals" },
  { emoji: "🎓", label: "Student Zone", slug: "student-zone" },
];

const STUDENT_DEALS = [
  { label: "₹79 MEAL", price: 79 },
  { label: "₹99 COMBO", price: 99 },
  { label: "₹149 BIRYANI", price: 149 },
  { label: "HOSTEL SPECIAL", price: 89 },
  { label: "FRIENDS COMBO", price: 199 },
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
  "https://images.unsplash.com/photo-1633945274405-2a0e6b4e0b0e?w=600&q=80",
  "https://images.unsplash.com/photo-1555244160-5904fc4c4b0a?w=600&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
];

export function FoodsWorld({ business }: { business: BusinessData }) {
  const accent = business.theme?.accentColor || "#D97706";
  const cream = business.theme?.secondaryColor || "#FEF3C7";
  const featured = business.products.filter((p) => p.isFeatured);
  const studentProducts = business.products.filter((p) => p.isStudent);
  const [titleSettled, setTitleSettled] = useState(false);

  return (
    <div className="min-h-screen bg-[#060a04]">
      <MasterNav
        businessNav={[
          { href: "#menu", label: "Menu" },
          { href: "#student-zone", label: "Student Zone" },
          { href: "#reviews", label: "Reviews" },
          { href: "/contact?business=foods", label: "Order" },
        ]}
        businessName="Foods"
        businessColor={accent}
      />

      {/* Hero — conversion focused, minimal 3D */}
      <section className="relative min-h-screen">
        {business.heroImage && (
          <Image src={business.heroImage} alt="J Foods" fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a04] via-[#060a04]/70 to-[#060a04]/30" />

        <div className="relative z-10 flex min-h-screen flex-col justify-end px-6 pb-20 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 1.15 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            onAnimationComplete={() => setTitleSettled(true)}
          >
            <p className="font-[family-name:var(--font-cinzel)] text-sm tracking-[0.5em] text-white/60">J</p>
            <h1 className="font-[family-name:var(--font-cormorant)] text-7xl font-light leading-none md:text-9xl" style={{ color: cream }}>
              FOODS
            </h1>
          </motion.div>

          {titleSettled && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-xl font-light tracking-wide text-white/60"
            >
              Taste the Tradition.
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <MagneticButton href="/contact?business=foods" dataCursor="taste">
              Order Now
            </MagneticButton>
            <MagneticButton href="#menu" variant="outline" dataCursor="taste">
              View Menu
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Craving categories */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-[family-name:var(--font-cormorant)] text-3xl text-white md:text-4xl">
            What are you craving?
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.label}
                href={`#${cat.slug}`}
                data-cursor="taste"
                className="group flex flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-amber-500/30 hover:bg-amber-500/5"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">{cat.emoji}</span>
                <span className="mt-3 text-xs tracking-[0.2em] uppercase text-white/60">{cat.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-white/[0.06]">
                {p.image && (
                  <div className="relative h-52">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="400px" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg text-white">{p.name}</h3>
                  <p className="mt-1 text-sm text-white/40">{p.description}</p>
                  <p className="mt-3 text-xl" style={{ color: accent }}>{formatCurrency(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Zone */}
      <section id="student-zone" className="relative overflow-hidden px-6 py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-green-900/20" />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="text-4xl">🎓</span>
          <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl" style={{ color: cream }}>
            J Student Zone
          </h2>
          <p className="mt-2 text-lg tracking-widest" style={{ color: accent }}>BIG TASTE. SMALL PRICE.</p>
          <p className="mt-8 font-[family-name:var(--font-cinzel)] text-5xl text-white">
            FROM <span style={{ color: accent }}>₹79</span>
          </p>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STUDENT_DEALS.map((deal, i) => (
              <motion.div
                key={deal.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-amber-500/20 bg-black/40 p-5 backdrop-blur-sm"
                data-cursor="taste"
              >
                <p className="text-sm tracking-[0.15em] text-white/70">{deal.label}</p>
                <p className="mt-2 text-2xl font-light" style={{ color: accent }}>
                  {formatCurrency(deal.price)}
                </p>
              </motion.div>
            ))}
          </div>

          {studentProducts.length > 0 && (
            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              {studentProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                  <span className="text-sm text-white">{p.name}</span>
                  <span style={{ color: accent }}>{formatCurrency(p.price)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12">
            <MagneticButton href="/contact?business=foods" dataCursor="taste">
              See Student Deals →
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section id="reviews" className="px-6 py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-[family-name:var(--font-cinzel)] text-3xl tracking-[0.2em] text-white/80">
            PEOPLE LOVE J
          </h2>
          <p className="mt-2 text-center text-[9px] tracking-[0.3em] uppercase text-white/25">
            Demo reviews — sample content
          </p>
          <div className="mt-16 space-y-12">
            {(business.reviews.length ? business.reviews : [
              { id: "1", rating: 5, comment: "The food was amazing." },
              { id: "2", rating: 5, comment: "Best biryani in Hyderabad!" },
            ]).slice(0, 3).map((r, i) => (
              <motion.blockquote
                key={r.id}
                initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="font-[family-name:var(--font-cormorant)] text-3xl font-light leading-snug text-white/80 md:text-4xl">
                  &ldquo;{r.comment}&rdquo;
                </p>
                <p className="mt-4 text-amber-400">★★★★★</p>
                <p className="mt-2 text-xs tracking-wider text-white/30">Hyderabad</p>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Visual gallery */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
            {GALLERY_IMAGES.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-lg ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:h-96" : "aspect-square"}`}
              >
                <Image src={src} alt="" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="400px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
