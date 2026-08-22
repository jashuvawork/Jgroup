"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MasterNav } from "@/components/layout/MasterNav";
import { Footer } from "@/components/layout/Footer";
import { SectionLabel, AmbientOrbs, PremiumButton } from "@/components/ui/Premium";
import { formatNumber } from "@/lib/utils";
import type { ImpactStatItem } from "@/lib/types";

interface Project {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  impactCount: number;
}

interface BusinessData {
  name: string;
  tagline: string | null;
  description: string;
  heroImage: string | null;
  theme: { primaryColor: string; secondaryColor: string; accentColor: string | null } | null;
  foundationProjects: Project[];
}

const FOUNDATION_NAV = [
  { href: "#mission", label: "Mission" },
  { href: "#projects", label: "Projects" },
  { href: "#impact", label: "Impact" },
  { href: "#volunteer", label: "Volunteer" },
  { href: "#donate", label: "Donate" },
];

function AnimatedCounter({ value, label, accent }: { value: number; label: string; accent: string }) {
  const [display, setDisplay] = useState(0);
  const spring = useSpring(0, { stiffness: 40, damping: 18 });

  useEffect(() => {
    spring.set(value);
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [value, spring]);

  return (
    <div className="card-glow rounded-2xl p-8 text-center">
      <p className="font-[family-name:var(--font-cinzel)] text-4xl font-medium text-white md:text-5xl">
        {formatNumber(display)}+
      </p>
      <p className="mt-3 text-[10px] tracking-[0.25em] uppercase" style={{ color: `${accent}99` }}>
        {label}
      </p>
    </div>
  );
}

export function FoundationWorld({ business, impactStats }: { business: BusinessData; impactStats: ImpactStatItem[] }) {
  const primary = business.theme?.primaryColor || "#1E40AF";
  const accent = business.theme?.accentColor || "#059669";

  return (
    <div className="min-h-screen bg-[#030810]">
      <MasterNav businessNav={FOUNDATION_NAV} businessName="Foundation" businessColor={accent} />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {business.heroImage && (
          <Image src={business.heroImage} alt="" fill className="object-cover opacity-25" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-[#030810]/90 to-[#030810]" />
        <AmbientOrbs colors={[primary, accent, "#60a5fa"]} />

        <div className="relative z-10 px-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SectionLabel accent={accent}>J Foundation</SectionLabel>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 font-[family-name:var(--font-source)] text-5xl font-light leading-tight text-white md:text-7xl lg:text-8xl"
          >
            {business.tagline || "Building a Better Tomorrow."}
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

      <section id="mission" className="px-6 py-28">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel accent={accent}>Why We Exist</SectionLabel>
          <h2 className="mt-6 font-[family-name:var(--font-source)] text-4xl font-light text-white">Our Mission</h2>
          <p className="mt-8 text-lg leading-[1.8] text-white/45">
            At J Foundation, we believe that business success means nothing without community impact.
            We channel resources from across the J ecosystem to create lasting change in education,
            food security, and community empowerment.
          </p>
        </div>
      </section>

      <section id="impact" className="relative px-6 py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
        <div className="relative mx-auto max-w-5xl">
          <SectionLabel accent={accent}>Making a Difference</SectionLabel>
          <h2 className="mt-6 text-center font-[family-name:var(--font-source)] text-4xl font-light text-white">
            Our Impact
          </h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat, i) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <AnimatedCounter value={stat.value} label={stat.label} accent={accent} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionLabel accent={accent}>On the Ground</SectionLabel>
          <h2 className="mt-6 text-center font-[family-name:var(--font-source)] text-4xl font-light text-white">
            Projects
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {business.foundationProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glow group overflow-hidden rounded-2xl"
              >
                {project.image && (
                  <div className="relative h-60 overflow-hidden">
                    <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="500px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030810] to-transparent" />
                  </div>
                )}
                <div className="p-7">
                  <h3 className="text-xl font-light text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/40">{project.description}</p>
                  {project.impactCount > 0 && (
                    <p className="mt-5 text-sm font-medium" style={{ color: accent }}>
                      {formatNumber(project.impactCount)} lives impacted
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="volunteer" className="px-6 py-28 text-center">
        <SectionLabel accent={accent}>Join Us</SectionLabel>
        <h2 className="mt-6 font-[family-name:var(--font-source)] text-4xl font-light text-white">Get Involved</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <PremiumButton href="/contact?business=foundation&type=volunteer" variant="outline" color={accent}>
            Volunteer
          </PremiumButton>
          <PremiumButton href="/contact?business=foundation&type=donate" id="donate">
            Donate
          </PremiumButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
