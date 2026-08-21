"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MasterNav } from "@/components/layout/MasterNav";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image: string | null;
  category: string | null;
  featured: boolean;
}

interface BusinessData {
  name: string;
  tagline: string | null;
  description: string;
  heroImage: string | null;
  theme: { primaryColor: string; secondaryColor: string; accentColor: string | null } | null;
  services: Service[];
}

const EVENTS_NAV = [
  { href: "#services", label: "Services" },
  { href: "#packages", label: "Packages" },
  { href: "#gallery", label: "Gallery" },
  { href: "#book", label: "Book Now" },
];

export function EventsWorld({ business }: { business: BusinessData }) {
  const primary = business.theme?.primaryColor || "#C084FC";
  const accent = business.theme?.accentColor || "#FBBF24";

  return (
    <div className="min-h-screen" style={{ background: "#0a0010" }}>
      <MasterNav businessNav={EVENTS_NAV} businessName="Surprise Events" businessColor={primary} />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {business.heroImage && (
          <Image src={business.heroImage} alt="" fill className="object-cover opacity-30" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 via-black/70 to-black" />

        {/* Floating confetti particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{ background: i % 3 === 0 ? primary : i % 3 === 1 ? accent : "#F472B6" }}
              animate={{
                y: ["-10%", "110%"],
                x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                rotate: [0, 360],
                opacity: [0, 0.8, 0],
              }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 3 }}
              initial={{ x: `${Math.random() * 100}%`, y: "-10%" }}
            />
          ))}
        </div>

        <div className="relative z-10 px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs tracking-[0.4em] uppercase"
            style={{ color: primary }}
          >
            J Surprise Events
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 font-[family-name:var(--font-playfair)] text-5xl font-light text-white md:text-7xl"
          >
            {business.tagline || "We Turn Moments Into Memories."}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mt-6 max-w-xl text-white/50"
          >
            {business.description}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-10 flex justify-center gap-4">
            <a href="#book" className="rounded-full px-8 py-3 text-sm tracking-wider uppercase text-black transition-transform hover:scale-105" style={{ background: primary }}>
              Book an Event
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener" className="rounded-full border border-white/20 px-8 py-3 text-sm tracking-wider uppercase text-white/70 transition-colors hover:border-white/40">
              WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-[family-name:var(--font-playfair)] text-3xl font-light text-white md:text-4xl">
            Our Services
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {business.services.map((svc, i) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition-all hover:border-white/15 hover:scale-[1.02]"
              >
                {svc.image && (
                  <div className="relative h-48 overflow-hidden">
                    <Image src={svc.image} alt={svc.name} fill className="object-cover transition-transform group-hover:scale-110" sizes="300px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-light text-white">{svc.name}</h3>
                  <p className="mt-1 text-sm text-white/40">{svc.description}</p>
                  {svc.price != null && svc.price > 0 && (
                    <p className="mt-3 text-sm" style={{ color: accent }}>
                      From {formatCurrency(svc.price)}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Book */}
      <section id="book" className="px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-light text-white">
            Get a Quote
          </h2>
          <p className="mt-4 text-white/40">Tell us about your dream event and we&apos;ll make it happen.</p>
          <Link href="/contact?business=events" className="mt-8 inline-block rounded-full px-10 py-4 text-sm tracking-wider uppercase text-black" style={{ background: primary }}>
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
