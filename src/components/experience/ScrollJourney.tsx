"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { BusinessWithTheme } from "@/lib/types";

const WORLD_META: Record<string, { emoji: string; line: string; cursor: string; mood: string }> = {
  "j-surprise-events": {
    emoji: "🎉",
    line: "Make moments unforgettable.",
    cursor: "celebrate",
    mood: "from-purple-950/40",
  },
  "j-foods": {
    emoji: "🍽️",
    line: "Taste the tradition.",
    cursor: "taste",
    mood: "from-green-950/40",
  },
  "j-foundation": {
    emoji: "❤️",
    line: "Create an impact that matters.",
    cursor: "impact",
    mood: "from-blue-950/40",
  },
};

interface ScrollJourneyProps {
  businesses: BusinessWithTheme[];
  onEnterWorld: (route: string) => void;
}

function WorldScene({
  biz,
  index,
  onEnter,
}: {
  biz: BusinessWithTheme;
  index: number;
  onEnter: () => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-30%" });
  const meta = WORLD_META[biz.slug] || { emoji: "✨", line: biz.tagline || "", cursor: "explore", mood: "" };
  const primary = biz.theme?.primaryColor || "#c9a227";

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen snap-start items-center justify-center overflow-hidden"
      data-cursor={meta.cursor}
    >
      {biz.heroImage && (
        <motion.div
          animate={{ scale: inView ? 1.05 : 1.15, opacity: inView ? 0.35 : 0.15 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image src={biz.heroImage} alt="" fill className="object-cover" sizes="100vw" />
        </motion.div>
      )}
      <div className={`absolute inset-0 bg-gradient-to-b ${meta.mood} via-[#010101]/90 to-[#010101]`} />

      <div className="relative z-10 px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-[10px] tracking-[0.5em] uppercase"
          style={{ color: primary }}
        >
          {biz.name}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 1.1 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="mt-6"
        >
          <p className="font-[family-name:var(--font-cinzel)] text-6xl font-medium tracking-[0.2em] text-white md:text-8xl">
            {biz.name.replace("J ", "").split(" ").map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-8 text-lg font-light tracking-wide text-white/45"
        >
          {meta.line}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <MagneticButton onClick={onEnter} variant="outline" dataCursor={meta.cursor}>
            Explore →
          </MagneticButton>
        </motion.div>
      </div>

      <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.4em] text-white/15">
        0{index + 1}
      </span>
    </section>
  );
}

export function ScrollJourney({ businesses, onEnterWorld }: ScrollJourneyProps) {
  return (
    <div className="snap-y snap-mandatory">
      {businesses.map((biz, i) => (
        <WorldScene key={biz.id} biz={biz} index={i} onEnter={() => onEnterWorld(biz.route)} />
      ))}

      {/* Future worlds */}
      <section className="relative flex min-h-screen snap-start items-center justify-center overflow-hidden bg-[#010101]">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute h-96 w-96 rounded-full border border-white/5" />
        </div>
        <div className="relative z-10 px-6 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/30">More worlds are coming</p>
          <h2 className="mt-6 font-[family-name:var(--font-cinzel)] text-4xl tracking-[0.15em] text-white/60 md:text-5xl">
            J is only getting started.
          </h2>
          <div className="mt-10 flex items-center justify-center gap-3 text-white/20">
            <span className="text-3xl">+</span>
            <span className="text-[10px] tracking-[0.4em] uppercase">Next J World</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative flex min-h-screen snap-start flex-col items-center justify-center bg-[#010101] px-6">
        <p className="font-[family-name:var(--font-cinzel)] text-[8rem] font-medium tracking-[0.3em] text-gradient-gold md:text-[12rem]">
          J
        </p>
        <p className="mt-6 text-[10px] tracking-[0.5em] uppercase text-white/40">One Vision.</p>
        <p className="mt-2 text-[10px] tracking-[0.5em] uppercase text-white/30">Many Possibilities.</p>
        <div className="mt-12">
          <MagneticButton href="/#explore" dataCursor="explore">
            Explore J →
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
