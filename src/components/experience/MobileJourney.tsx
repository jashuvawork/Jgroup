"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import type { BusinessWithTheme } from "@/lib/types";

const META: Record<string, { line: string }> = {
  "j-surprise-events": { line: "Make moments unforgettable." },
  "j-foods": { line: "Taste the tradition." },
  "j-foundation": { line: "Create an impact that matters." },
};

interface MobileJourneyProps {
  businesses: BusinessWithTheme[];
  onEnterWorld: (route: string) => void;
  onExplore: () => void;
}

export function MobileJourney({ businesses, onEnterWorld, onExplore }: MobileJourneyProps) {
  const [phase, setPhase] = useState<"intro" | "explore" | "worlds">("intro");
  const [index, setIndex] = useState(0);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -80 && index < businesses.length - 1) setIndex((i) => i + 1);
    if (info.offset.y > 80 && index > 0) setIndex((i) => i - 1);
  };

  if (phase === "intro") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#010101] px-6">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-[family-name:var(--font-cinzel)] text-[6rem] text-gradient-gold"
        >
          J
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-[10px] tracking-[0.5em] text-white/50"
        >
          ONE VISION.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-2 text-[10px] tracking-[0.5em] text-white/35"
        >
          MANY POSSIBILITIES.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          onClick={() => setPhase("explore")}
          className="mt-16 text-[10px] tracking-[0.4em] uppercase text-amber-400/70"
        >
          Swipe up to explore ↑
        </motion.button>
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y < -60) setPhase("explore");
          }}
          className="absolute inset-0"
        />
      </div>
    );
  }

  if (phase === "explore") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#010101] px-6">
        <p className="text-[10px] tracking-[0.5em] uppercase text-white/40">Explore J</p>
        <button
          onClick={() => setPhase("worlds")}
          className="mt-8 rounded-full border border-white/20 px-10 py-4 text-[10px] tracking-[0.3em] uppercase text-white/70"
        >
          Enter J Space →
        </button>
        <button onClick={onExplore} className="mt-6 text-[9px] tracking-[0.3em] text-white/25">
          Skip
        </button>
      </div>
    );
  }

  const biz = businesses[index];
  const meta = META[biz.slug];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#010101]">
      <AnimatePresence mode="wait">
        <motion.div
          key={biz.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 flex flex-col"
        >
          {biz.heroImage && (
            <div className="relative h-[55vh]">
              <Image src={biz.heroImage} alt="" fill className="object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#010101]" />
            </div>
          )}
          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: biz.theme?.primaryColor }}>
              {biz.name}
            </p>
            <p className="mt-4 font-[family-name:var(--font-cinzel)] text-3xl tracking-wider text-white">
              {biz.name.replace("J ", "")}
            </p>
            <p className="mt-4 text-white/45">{meta?.line}</p>
            <button
              onClick={() => onEnterWorld(biz.route)}
              className="mt-10 rounded-full bg-gradient-to-r from-[#c9a227] to-[#e8d48b] px-10 py-4 text-[10px] tracking-[0.3em] uppercase text-black"
            >
              Enter →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {businesses.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all"
            style={{
              width: i === index ? 24 : 6,
              background: i === index ? "#c9a227" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
