"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MasterNav } from "@/components/layout/MasterNav";
import { Footer } from "@/components/layout/Footer";
import { SectionLabel, AmbientOrbs, PremiumButton } from "@/components/ui/Premium";
import { CONTACT } from "@/lib/contact";
import { BOOKING_NOTES, EVENT_CATEGORY_LABELS, MALL_BEACH_GIFTS } from "@/lib/events-content";
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
  { href: "#packages", label: "Packages" },
  { href: "#gifts", label: "Gifts" },
  { href: "#book", label: "Book Now" },
];

const CATEGORY_ORDER = ["standard", "exclusive", "decoration"] as const;

function PackageCard({
  svc,
  i,
  primary,
  accent,
}: {
  svc: Service;
  i: number;
  primary: string;
  accent: string;
}) {
  const onRequest = svc.price === 0 || svc.price == null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}
      className="card-glow group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06]"
    >
      {svc.image && (
        <div className="relative h-44 overflow-hidden sm:h-48">
          <Image
            src={svc.image}
            alt={svc.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08000f] via-[#08000f]/50 to-transparent" />
          {svc.featured && (
            <span
              className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-medium tracking-wider uppercase"
              style={{ background: `${accent}35`, color: accent }}
            >
              Popular
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg leading-snug text-white">{svc.name}</h3>
        {svc.description && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-white/45">{svc.description}</p>
        )}
        <p className="mt-4 text-sm font-medium" style={{ color: accent }}>
          {onRequest ? "Price on request" : `From ${formatCurrency(svc.price!)}`}
        </p>
        <a
          href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Hi! I'm interested in the ${svc.name} package.`)}`}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors hover:bg-white/5"
          style={{ borderColor: `${primary}50`, color: primary }}
        >
          Book on WhatsApp
        </a>
      </div>
    </motion.div>
  );
}

export function EventsWorld({ business }: { business: BusinessData }) {
  const primary = business.theme?.primaryColor || "#C084FC";
  const accent = business.theme?.accentColor || "#FBBF24";

  const grouped = CATEGORY_ORDER.map((cat) => ({
    key: cat,
    label: EVENT_CATEGORY_LABELS[cat] ?? cat,
    items: business.services
      .filter((s) => (s.category ?? "standard") === cat)
      .sort((a, b) => (a.price ?? 0) - (b.price ?? 0)),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-[#08000f]">
      <MasterNav businessNav={EVENTS_NAV} businessName="Surprise Events" businessColor={primary} />

      {/* Hero */}
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
            className="mt-8 font-[family-name:var(--font-playfair)] text-4xl font-light leading-tight text-white sm:text-5xl md:text-7xl lg:text-8xl"
          >
            {business.tagline || "We Create Moments. You Cherish Forever."}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm tracking-[0.35em] uppercase text-white/50"
          >
            Every Surprise, Made Special
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/45"
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
              href="#packages"
              className="btn-premium inline-flex min-h-[48px] items-center justify-center rounded-full px-8 py-3.5 text-xs font-medium tracking-[0.2em] uppercase text-white transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
            >
              View Packages
            </a>
            <PremiumButton href={CONTACT.whatsappUrl} variant="outline" color={primary}>
              WhatsApp {CONTACT.phone}
            </PremiumButton>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent"
          />
        </div>
      </section>

      {/* Packages by category */}
      <div id="packages">
        {grouped.map((group, gi) => (
          <section key={group.key} className="relative px-6 py-20 md:py-28">
            <div className="mx-auto max-w-7xl">
              <SectionLabel accent={gi === 0 ? primary : accent}>{group.label}</SectionLabel>
              <h2 className="mt-6 text-center font-[family-name:var(--font-playfair)] text-3xl font-light text-white md:text-5xl">
                {group.label}
              </h2>
              {group.key === "exclusive" && (
                <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/40">
                  Upgraded experiences for unforgettable celebrations.
                </p>
              )}
              <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map((svc, i) => (
                  <PackageCard key={svc.id} svc={svc} i={i} primary={primary} accent={accent} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Mall & beach gift inclusions */}
      <section id="gifts" className="relative border-t border-white/[0.06] px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 to-transparent" />
        <div className="relative mx-auto max-w-4xl">
          <SectionLabel accent={accent}>Included Gifts</SectionLabel>
          <h2 className="mt-6 text-center font-[family-name:var(--font-playfair)] text-3xl font-light text-white md:text-4xl">
            Mall &amp; Beach Surprise Gifts
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-white/40">
            Basic gifts included with mall and beach surprise packages — for boys and girls.
          </p>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2">
            {MALL_BEACH_GIFTS.map((gift, i) => (
              <motion.li
                key={gift}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white/70"
              >
                <span className="text-xs" style={{ color: accent }}>
                  ✦
                </span>
                {gift}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Book */}
      <section id="book" className="relative px-6 py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/15 to-transparent" />
        <div className="relative mx-auto max-w-2xl text-center">
          <SectionLabel accent={accent}>Let&apos;s Celebrate</SectionLabel>
          <h2 className="mt-6 font-[family-name:var(--font-playfair)] text-4xl font-light text-white md:text-5xl">
            Book Your Surprise Now
          </h2>
          <p className="mt-6 text-white/45">Let us plan your perfect moment.</p>
          <p className="mt-2 text-lg text-white/70">{CONTACT.phone}</p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <PremiumButton href={CONTACT.whatsappUrl}>WhatsApp Us</PremiumButton>
            <PremiumButton href={CONTACT.phoneTel} variant="outline" color={primary}>
              Call Now
            </PremiumButton>
          </div>

          <ul className="mt-14 space-y-3 text-left text-sm text-white/35">
            {BOOKING_NOTES.map((note) => (
              <li key={note} className="flex gap-2">
                <span style={{ color: accent }}>•</span>
                {note}
              </li>
            ))}
          </ul>

          <p className="mt-12 font-[family-name:var(--font-cinzel)] text-sm tracking-[0.25em] text-white/30 uppercase">
            Surprise More. Celebrate More. Cherish Forever.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
