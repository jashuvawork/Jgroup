"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MasterNav } from "@/components/layout/MasterNav";
import { Footer } from "@/components/layout/Footer";
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

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BusinessData {
  name: string;
  tagline: string | null;
  description: string;
  heroImage: string | null;
  theme: { primaryColor: string; secondaryColor: string; accentColor: string | null } | null;
  products: Product[];
  categories: Category[];
}

const FOODS_NAV = [
  { href: "#menu", label: "Menu" },
  { href: "#combos", label: "Combos" },
  { href: "#student-zone", label: "Student Zone" },
  { href: "#catering", label: "Catering" },
  { href: "/contact?business=foods", label: "Orders" },
];

export function FoodsWorld({ business }: { business: BusinessData }) {
  const primary = business.theme?.primaryColor || "#166534";
  const cream = business.theme?.secondaryColor || "#FEF3C7";
  const accent = business.theme?.accentColor || "#D97706";

  const studentProducts = business.products.filter((p) => p.isStudent);
  const featuredProducts = business.products.filter((p) => p.isFeatured);
  const comboProducts = business.products.filter((p) => p.isCombo);

  return (
    <div className="min-h-screen" style={{ background: "#0a0f05" }}>
      <MasterNav businessNav={FOODS_NAV} businessName="Foods" businessColor={primary} />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {business.heroImage && (
          <Image src={business.heroImage} alt="" fill className="object-cover opacity-25" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/40 via-black/80 to-black" />

        {/* Steam particles */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-16 w-16 rounded-full bg-white/5 blur-xl"
              animate={{ y: [0, -100], opacity: [0.3, 0], scale: [1, 2] }}
              transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 4 }}
              style={{ left: `${10 + i * 7}%`, bottom: "20%" }}
            />
          ))}
        </div>

        <div className="relative z-10 px-6 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs tracking-[0.4em] uppercase" style={{ color: accent }}>
            J Foods
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl font-light md:text-7xl"
            style={{ color: cream }}
          >
            {business.tagline || "Taste the Tradition."}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mx-auto mt-6 max-w-xl text-white/50">
            {business.description}
          </motion.p>
        </div>
      </section>

      {/* Best Sellers */}
      <section id="menu" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-[family-name:var(--font-cormorant)] text-3xl font-light md:text-4xl" style={{ color: cream }}>
            Best Sellers
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition-all hover:scale-[1.02]"
              >
                {product.image && (
                  <div className="relative h-56 overflow-hidden">
                    <Image src={product.image} alt={product.name} fill className="object-cover transition-transform group-hover:scale-110" sizes="400px" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-light text-white">{product.name}</h3>
                  <p className="mt-1 text-sm text-white/40">{product.description}</p>
                  <p className="mt-3 text-xl font-light" style={{ color: accent }}>{formatCurrency(product.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Zone */}
      <section id="student-zone" className="relative px-6 py-24">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primary}20, transparent)` }} />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-3xl">🎓</span>
            <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl font-light md:text-4xl" style={{ color: cream }}>
              J Student Zone
            </h2>
            <p className="mt-2 text-lg" style={{ color: accent }}>Big Taste. Student Prices.</p>
            <p className="mt-4 text-2xl font-light text-white">
              Meals from <span style={{ color: accent }}>₹79</span>
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studentProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm"
              >
                {product.image && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="64px" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">{product.name}</h3>
                  <p className="text-xs text-white/40">{product.description}</p>
                </div>
                <p className="text-lg font-light" style={{ color: accent }}>{formatCurrency(product.price)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Combos */}
      <section id="combos" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-[family-name:var(--font-cormorant)] text-3xl font-light" style={{ color: cream }}>
            Combos & Packs
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {comboProducts.map((product) => (
              <div key={product.id} className="rounded-2xl border border-white/5 bg-white/5 p-6">
                <h3 className="text-lg text-white">{product.name}</h3>
                <p className="mt-1 text-sm text-white/40">{product.description}</p>
                <p className="mt-4 text-2xl font-light" style={{ color: accent }}>{formatCurrency(product.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catering */}
      <section id="catering" className="px-6 py-24 text-center">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light" style={{ color: cream }}>
          Catering & Wedding Catering
        </h2>
        <p className="mt-4 text-white/40">From intimate gatherings to grand weddings.</p>
        <Link href="/contact?business=foods" className="mt-8 inline-block rounded-full px-10 py-4 text-sm tracking-wider uppercase text-black" style={{ background: accent }}>
          Get Catering Quote
        </Link>
      </section>

      <Footer />
    </div>
  );
}
