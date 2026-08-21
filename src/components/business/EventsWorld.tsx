"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MasterNav } from "@/components/layout/MasterNav";
import { Footer } from "@/components/layout/Footer";
import { SectionLabel, AmbientOrbs, PremiumButton } from "@/components/ui/Premium";
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
    <div className="min-h-screen bg-[#08000f]">
      <MasterNav businessNav={EVENTS_NAV} businessName="Surprise Events" businessColor={primary} />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {business.heroImage && (
          <Image src={business.heroImage} alt="" fill className="object-cover opacity-35 scale-105" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/60 via-[#08000f]/80 to-[#08000f]" />
        <AmbientOrbs colors={[primary, accent, "#F472B6"]} />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-sm"
              style={{
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 2) * 2,
                background: i % 3 === 0 ? primary : i % 3 === 1 ? accent : "#F472B6",
              }}
              animate={{
                y: ["-10%", "110%"],
                x: [`${(i * 17) % 100}%`, `${(i * 23) % 100}%`],
                rotate: [0, 360],
                opacity: [0, 0.7, 0],
              }}
              transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: (i % 4) * 0.8 }}
              initial={{ x: `${(i * 17) % 100}%`, y: "-10%" }}
            />
          ))}
        </div>

        <div className="relative z-10 px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SectionLabel accent={primary}>J Surprise Events</SectionLabel>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="mt-8 font-[family-name:var(--font-playfair)] text-5xl font-light leading-tight text-white md:text-7xl lg:text-8xl"
          >
            {business.tagline || "We Turn Moments Into Memories."}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-white/45"
          >
            {business.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            <a
              href="#book"
              className="btn-premium inline-flex items-center justify-center rounded-full px-8 py-3.5 text-xs font-medium tracking-[0.2em] uppercase text-white transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
            >
              Book an Event
            </a>
            <PremiumButton href="https://wa.me/919876543210" variant="outline" color={primary}>
              WhatsApp
            </PremiumButton>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      <section id="services" className="relative px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionLabel accent={primary}>What We Create</SectionLabel>
          <h2 className="mt-6 text-center font-[family-name:var(--font-playfair)] text-3xl font-light text-white md:text-5xl">
            Our Services
          </h2>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {business.services.map((svc, i) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="card-glow group overflow-hidden rounded-2xl"
              >
                {svc.image && (
                  <div className="relative h-52 overflow-hidden">
                    <Image src={svc.image} alt={svc.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="300px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08000f] via-[#08000f]/40 to-transparent" />
                    {svc.featured && (
                      <span className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[9px] tracking-wider uppercase" style={{ background: `${accent}30`, color: accent }}>
                        Popular
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg text-white">{svc.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/40">{svc.description}</p>
                  {svc.price != null && svc.price > 0 && (
                    <p className="mt-4 text-sm font-medium" style={{ color: accent }}>
                      From {formatCurrency(svc.price)}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="relative px-6 py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />
        <div className="relative mx-auto max-w-2xl text-center">
          <SectionLabel accent={accent}>Let&apos;s Celebrate</SectionLabel>
          <h2 className="mt-6 font-[family-name:var(--font-playfair)] text-4xl font-light text-white md:text-5xl">
            Get a Quote
          </h2>
          <p className="mt-6 text-white/40">Tell us about your dream event and we&apos;ll make it happen.</p>
          <div className="mt-10">
            <PremiumButton href="/contact?business=events">Contact Us</PremiumButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
