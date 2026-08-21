"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MasterNav } from "@/components/layout/MasterNav";
import { Footer } from "@/components/layout/Footer";
import { SectionLabel, AmbientOrbs, PremiumButton } from "@/components/ui/Premium";
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

interface BusinessData {
  name: string;
  tagline: string | null;
  description: string;
  heroImage: string | null;
  theme: { primaryColor: string; secondaryColor: string; accentColor: string | null } | null;
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
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
    <div className="min-h-screen bg-[#060a04]">
      <MasterNav businessNav={FOODS_NAV} businessName="Foods" businessColor={accent} />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {business.heroImage && (
          <Image src={business.heroImage} alt="" fill className="object-cover opacity-30" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/50 via-[#060a04]/85 to-[#060a04]" />
        <AmbientOrbs colors={[primary, accent, cream]} />

        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-amber-200/10 blur-xl"
              style={{ width: 40 + i * 8, height: 40 + i * 8, left: `${8 + i * 6}%`, bottom: "15%" }}
              animate={{ y: [0, -120], opacity: [0.4, 0], scale: [1, 2.5] }}
              transition={{ duration: 5 + i * 0.3, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>

        <div className="relative z-10 px-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SectionLabel accent={accent}>J Foods</SectionLabel>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 font-[family-name:var(--font-cormorant)] text-5xl font-light leading-tight md:text-7xl lg:text-8xl"
            style={{ color: cream }}
          >
            {business.tagline || "Taste the Tradition."}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-white/45"
          >
            {business.description}
          </motion.p>
        </div>
      </section>

      <section id="menu" className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionLabel accent={accent}>Chef&apos;s Picks</SectionLabel>
          <h2 className="mt-6 text-center font-[family-name:var(--font-cormorant)] text-4xl font-light md:text-5xl" style={{ color: cream }}>
            Best Sellers
          </h2>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glow group overflow-hidden rounded-2xl"
              >
                {product.image && (
                  <div className="relative h-60 overflow-hidden">
                    <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="400px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060a04] to-transparent opacity-60" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-white">{product.name}</h3>
                  <p className="mt-2 text-sm text-white/40">{product.description}</p>
                  <p className="mt-4 font-[family-name:var(--font-cormorant)] text-2xl" style={{ color: accent }}>{formatCurrency(product.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="student-zone" className="relative px-6 py-28">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${primary}15, transparent 70%)` }} />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-4xl">🎓</span>
            <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light md:text-5xl" style={{ color: cream }}>
              J Student Zone
            </h2>
            <p className="mt-3 text-lg tracking-wide" style={{ color: accent }}>Big Taste. Student Prices.</p>
            <div className="mx-auto mt-6 inline-block rounded-2xl border px-8 py-4" style={{ borderColor: `${accent}30`, background: `${accent}08` }}>
              <p className="text-sm text-white/50">Meals from</p>
              <p className="font-[family-name:var(--font-cormorant)] text-4xl" style={{ color: accent }}>₹79</p>
            </div>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studentProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-glow flex items-center gap-4 rounded-xl p-4"
              >
                {product.image && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="64px" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-sm font-medium text-white">{product.name}</h3>
                  <p className="truncate text-xs text-white/40">{product.description}</p>
                </div>
                <p className="shrink-0 font-[family-name:var(--font-cormorant)] text-xl" style={{ color: accent }}>{formatCurrency(product.price)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="combos" className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionLabel accent={accent}>Share the Feast</SectionLabel>
          <h2 className="mt-6 text-center font-[family-name:var(--font-cormorant)] text-4xl font-light" style={{ color: cream }}>
            Combos & Packs
          </h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {comboProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glow rounded-2xl p-7"
              >
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-white">{product.name}</h3>
                <p className="mt-2 text-sm text-white/40">{product.description}</p>
                <p className="mt-5 font-[family-name:var(--font-cormorant)] text-3xl" style={{ color: accent }}>{formatCurrency(product.price)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="catering" className="px-6 py-28 text-center">
        <SectionLabel accent={accent}>For Every Occasion</SectionLabel>
        <h2 className="mt-6 font-[family-name:var(--font-cormorant)] text-4xl font-light" style={{ color: cream }}>
          Catering & Wedding Catering
        </h2>
        <p className="mt-4 text-white/40">From intimate gatherings to grand weddings.</p>
        <div className="mt-10">
          <PremiumButton href="/contact?business=foods">Get Catering Quote</PremiumButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
