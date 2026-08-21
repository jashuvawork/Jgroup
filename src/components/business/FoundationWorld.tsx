"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MasterNav } from "@/components/layout/MasterNav";
import { Footer } from "@/components/layout/Footer";
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

function AnimatedCounter({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(0);
  const spring = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    spring.set(value);
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [value, spring]);

  return (
    <div className="text-center">
      <p className="text-4xl font-light text-white md:text-5xl">{formatNumber(display)}+</p>
      <p className="mt-2 text-xs tracking-[0.2em] uppercase text-white/40">{label}</p>
    </div>
  );
}

export function FoundationWorld({ business, impactStats }: { business: BusinessData; impactStats: ImpactStatItem[] }) {
  const primary = business.theme?.primaryColor || "#1E40AF";
  const accent = business.theme?.accentColor || "#059669";

  return (
    <div className="min-h-screen" style={{ background: "#030810" }}>
      <MasterNav businessNav={FOUNDATION_NAV} businessName="Foundation" businessColor={primary} />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {business.heroImage && (
          <Image src={business.heroImage} alt="" fill className="object-cover opacity-20" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-black/80 to-black" />

        <div className="relative z-10 px-6 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs tracking-[0.4em] uppercase" style={{ color: accent }}>
            J Foundation
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 font-[family-name:var(--font-source)] text-5xl font-light text-white md:text-7xl"
          >
            {business.tagline || "Building a Better Tomorrow."}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mx-auto mt-6 max-w-xl text-white/50">
            {business.description}
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-source)] text-3xl font-light text-white">Our Mission</h2>
          <p className="mt-6 text-lg leading-relaxed text-white/50">
            At J Foundation, we believe that business success means nothing without community impact.
            We channel resources from across the J ecosystem to create lasting change in education,
            food security, and community empowerment.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center font-[family-name:var(--font-source)] text-3xl font-light text-white">
            Our Impact
          </h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat) => (
              <AnimatedCounter key={stat.key} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-[family-name:var(--font-source)] text-3xl font-light text-white">
            Projects
          </h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {business.foundationProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="overflow-hidden rounded-2xl border border-white/5 bg-white/5"
              >
                {project.image && (
                  <div className="relative h-56">
                    <Image src={project.image} alt={project.title} fill className="object-cover" sizes="500px" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-light text-white">{project.title}</h3>
                  <p className="mt-2 text-sm text-white/40">{project.description}</p>
                  {project.impactCount > 0 && (
                    <p className="mt-4 text-sm" style={{ color: accent }}>
                      {formatNumber(project.impactCount)} lives impacted
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer & Donate */}
      <section id="volunteer" className="px-6 py-16 text-center">
        <h2 className="font-[family-name:var(--font-source)] text-3xl font-light text-white">Get Involved</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/contact?business=foundation&type=volunteer" className="rounded-full border border-white/20 px-10 py-4 text-sm tracking-wider uppercase text-white/70 transition-colors hover:border-white/40">
            Volunteer
          </Link>
          <Link href="/contact?business=foundation&type=donate" id="donate" className="rounded-full px-10 py-4 text-sm tracking-wider uppercase text-white" style={{ background: primary }}>
            Donate
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
