"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SectionLabel, AmbientOrbs } from "@/components/ui/Premium";
import type { BusinessWithTheme } from "@/lib/types";

interface Fallback2DProps {
  businesses: BusinessWithTheme[];
}

const EMOJI_MAP: Record<string, string> = {
  "j-surprise-events": "🎉",
  "j-foods": "🍽️",
  "j-foundation": "❤️",
};

export function Fallback2D({ businesses }: Fallback2DProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030303]">
      <AmbientOrbs />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="mb-20 text-center"
        >
          <div className="relative inline-block">
            <h1 className="font-[family-name:var(--font-cinzel)] text-[7rem] font-medium tracking-[0.12em] text-gradient-gold md:text-[9rem]">
              J
            </h1>
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-amber-500/20 via-violet-500/10 to-transparent blur-3xl" />
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <p className="text-[10px] tracking-[0.45em] uppercase text-white/35">
              One Vision. Many Possibilities.
            </p>
          </div>
        </motion.div>

        <div id="explore" className="w-full max-w-5xl">
          <SectionLabel>Explore J</SectionLabel>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {businesses.map((biz, i) => (
              <motion.div
                key={biz.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              >
                <Link href={biz.route} className="group block">
                  <div className="card-glow relative overflow-hidden rounded-2xl">
                    {biz.heroImage && (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={biz.heroImage}
                          alt={biz.name}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent" />
                        <div
                          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          style={{ background: `linear-gradient(135deg, ${biz.theme?.primaryColor}20, transparent)` }}
                        />
                      </div>
                    )}
                    <div className="relative p-6">
                      <span className="text-2xl">{EMOJI_MAP[biz.slug] || "✨"}</span>
                      <h3 className="mt-3 font-[family-name:var(--font-cinzel)] text-lg tracking-wide text-white">
                        {biz.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/45">{biz.tagline}</p>
                      <div className="mt-5 flex items-center gap-2">
                        <span
                          className="text-[10px] tracking-[0.25em] uppercase"
                          style={{ color: biz.theme?.primaryColor || "#c9a227" }}
                        >
                          Enter World
                        </span>
                        <span className="text-white/20 transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="mt-14 text-center text-[9px] tracking-[0.4em] uppercase text-white/15">
            More J worlds are coming
          </p>
        </div>
      </div>
    </div>
  );
}
