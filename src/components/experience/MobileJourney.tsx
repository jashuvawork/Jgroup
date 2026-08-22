"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import { WORLD_LAYOUT } from "@/lib/hub-worlds";
import type { BusinessWithTheme } from "@/lib/types";

interface MobileJourneyProps {
  businesses: BusinessWithTheme[];
  onEnterWorld: (route: string) => void;
  onExplore: () => void;
}

export function MobileJourney({ businesses, onEnterWorld, onExplore }: MobileJourneyProps) {
  const [phase, setPhase] = useState<"intro" | "worlds">("intro");
  const [index, setIndex] = useState(0);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 && index < businesses.length) setIndex((i) => i + 1);
    if (info.offset.x > 60 && index > 0) setIndex((i) => i - 1);
  };

  if (phase === "intro") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#080807] px-6">
        <motion.p
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hub-j-hero font-[family-name:var(--font-cinzel)] text-[7rem] font-semibold leading-none"
        >
          J
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xs tracking-[0.55em] text-white/50"
        >
          ONE VISION.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-2 text-xs tracking-[0.55em] text-white/35"
        >
          MANY POSSIBILITIES.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          onClick={() => setPhase("worlds")}
          className="mt-16 min-h-[48px] rounded-full border border-white/20 px-10 py-4 text-[10px] tracking-[0.35em] uppercase text-white/70"
        >
          Explore Destinations →
        </motion.button>
        <button onClick={onExplore} className="mt-6 min-h-[44px] text-[9px] tracking-[0.3em] text-white/25">
          Skip
        </button>
      </div>
    );
  }

  const isFuture = index >= businesses.length;
  const biz = !isFuture ? businesses[index] : null;
  const layout = biz ? WORLD_LAYOUT[biz.slug] : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080807]">
      <AnimatePresence mode="wait">
        <motion.div
          key={isFuture ? "future" : biz!.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 flex flex-col"
        >
          {!isFuture && biz && layout ? (
            <>
              <div className="relative h-[58vh]">
                <Image
                  src={biz.heroImage || layout.photo}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#080807]/30 via-transparent to-[#080807]" />
              </div>
              <div className="flex flex-1 flex-col items-center justify-center px-6 pb-28 text-center">
                <p
                  className="font-[family-name:var(--font-cinzel)] text-3xl tracking-[0.12em] md:text-4xl"
                  style={{ color: layout.accent }}
                >
                  {layout.label}
                </p>
                <p className="mt-5 text-lg text-white/55">{layout.tagline}</p>
                <button
                  onClick={() => onEnterWorld(biz.route)}
                  className="mt-12 min-h-[52px] rounded-full bg-gradient-to-r from-[#8a7340] to-[#c9a227] px-12 py-4 text-[10px] tracking-[0.35em] uppercase text-black"
                >
                  Enter →
                </button>
              </div>
            </>
          ) : (
            <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
              <p className="text-xs tracking-[0.4em] text-white/40">MORE J WORLDS</p>
              <p className="mt-4 font-[family-name:var(--font-cinzel)] text-2xl text-white/50">Coming soon.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
        {[...businesses, { id: "future" }].map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Go to destination ${i + 1}`}
          >
            <div
              className="h-1 rounded-full transition-all"
              style={{
                width: i === index ? 28 : 8,
                background: i === index ? "#c9a227" : "rgba(255,255,255,0.2)",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
