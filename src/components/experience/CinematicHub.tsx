"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { WORLD_LAYOUT } from "@/lib/hub-worlds";
import type { BusinessWithTheme } from "@/lib/types";

const CARD_ORDER = ["j-surprise-events", "j-foods", "j-foundation"] as const;

const CARD_LAYOUT: Record<string, { className: string; cursor: string; featured?: boolean }> = {
  "j-surprise-events": {
    className: "md:col-start-1 md:row-start-1 md:mt-8",
    cursor: "celebrate",
  },
  "j-foods": {
    className: "md:col-start-2 md:row-start-1 md:-mt-4 md:scale-[1.04] z-10",
    cursor: "taste",
    featured: true,
  },
  "j-foundation": {
    className: "md:col-start-3 md:row-start-1 md:mt-12",
    cursor: "impact",
  },
};

interface WorldPortalCardProps {
  business: BusinessWithTheme;
  onEnter: (route: string) => void;
  onHover: (slug: string | null) => void;
  index: number;
}

function WorldPortalCard({ business, onEnter, onHover, index }: WorldPortalCardProps) {
  const layout = WORLD_LAYOUT[business.slug];
  const cardLayout = CARD_LAYOUT[business.slug];
  if (!layout || !cardLayout) return null;

  const photo = business.heroImage || layout.photo;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.35 + index * 0.12, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -10, scale: cardLayout.featured ? 1.06 : 1.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onEnter(business.route)}
      onMouseEnter={() => onHover(business.slug)}
      onMouseLeave={() => onHover(null)}
      data-cursor={cardLayout.cursor}
      className={`world-portal-card group relative w-full text-left ${cardLayout.className}`}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0b] shadow-2xl transition-[border-color,box-shadow] duration-500 group-hover:border-white/20 md:aspect-[4/5]"
        style={{
          boxShadow: `0 24px 80px -20px ${layout.accent}22`,
        }}
      >
        <Image
          src={photo}
          alt={layout.label}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${layout.accent}18 0%, transparent 55%)`,
          }}
        />

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <p
            className="font-[family-name:var(--font-cinzel)] text-xl font-medium tracking-[0.12em] text-white md:text-2xl"
            style={{ color: layout.accent }}
          >
            {layout.label}
          </p>
          <p className="mt-2 text-sm font-light text-white/55 md:text-base">{layout.tagline}</p>
          <p className="mt-5 text-[10px] tracking-[0.35em] text-white/0 transition-all duration-300 group-hover:text-white/70">
            ENTER →
          </p>
        </div>

        <div
          className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-all duration-500 group-hover:w-full"
        />
      </div>
    </motion.button>
  );
}

interface CinematicHubProps {
  businesses: BusinessWithTheme[];
  onEnterWorld: (route: string) => void;
  onHoverWorld?: (slug: string | null) => void;
}

export function CinematicHub({ businesses, onEnterWorld, onHoverWorld }: CinematicHubProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const glowX = useTransform(smoothX, [-1, 1], ["42%", "58%"]);
  const glowY = useTransform(smoothY, [-1, 1], ["28%", "42%"]);
  const jRotateX = useTransform(smoothY, [-1, 1], [4, -4]);
  const jRotateY = useTransform(smoothX, [-1, 1], [-6, 6]);

  const ordered = CARD_ORDER.map((slug) => businesses.find((b) => b.slug === slug)).filter(
    Boolean
  ) as BusinessWithTheme[];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#050504]"
    >
      {/* Ambient atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(201,162,39,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(107,155,122,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_10%_70%,rgba(212,165,116,0.05),transparent)]" />
        <motion.div
          className="absolute h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
          style={{
            left: glowX,
            top: glowY,
            background: "radial-gradient(circle, rgba(201,162,39,0.14) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#050504_85%)]" />
      </div>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-28 text-center md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
          style={{ rotateX: jRotateX, rotateY: jRotateY, transformPerspective: 800 }}
          className="hub-j-hero-wrap"
        >
          <h1 className="hub-j-hero font-[family-name:var(--font-cinzel)] text-[5.5rem] font-semibold leading-none md:text-[8rem] lg:text-[9rem]">
            J
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-5 text-[11px] tracking-[0.55em] text-white/50 md:text-xs"
        >
          ONE VISION.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 1 }}
          className="mt-2 text-[11px] tracking-[0.55em] text-white/30 md:text-xs"
        >
          MANY POSSIBILITIES.
        </motion.p>
      </div>

      {/* World destinations */}
      <div className="relative z-10 mx-auto mt-10 w-full max-w-6xl flex-1 px-5 pb-16 md:mt-6 md:px-8 md:pb-20">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {ordered.map((biz, i) => (
            <WorldPortalCard
              key={biz.id}
              business={biz}
              onEnter={onEnterWorld}
              onHover={(slug) => onHoverWorld?.(slug)}
              index={i}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 text-center"
        >
          <p className="text-[10px] tracking-[0.4em] text-white/25">MORE J WORLDS</p>
          <p className="mt-1 text-[9px] tracking-[0.25em] text-white/15">Coming soon.</p>
        </motion.div>
      </div>
    </div>
  );
}
