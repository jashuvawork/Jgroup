"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen bg-black">
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-16 text-center"
        >
          <h1 className="text-8xl font-extralight tracking-[0.3em] text-white md:text-9xl">
            J
          </h1>
          <p className="mt-4 text-xs tracking-[0.4em] uppercase text-white/40">
            One Vision. Many Possibilities.
          </p>
        </motion.div>

        <div id="explore" className="w-full max-w-5xl">
          <h2 className="mb-12 text-center text-xs tracking-[0.3em] uppercase text-white/30">
            Explore J
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {businesses.map((biz, i) => (
              <motion.div
                key={biz.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
              >
                <Link href={biz.route} className="group block">
                  <div
                    className="relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-500 group-hover:border-white/20 group-hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(135deg, ${biz.theme?.primaryColor}15, ${biz.theme?.secondaryColor}10)`,
                    }}
                  >
                    {biz.heroImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={biz.heroImage}
                          alt={biz.name}
                          fill
                          className="object-cover opacity-60 transition-opacity group-hover:opacity-80"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-2xl">{EMOJI_MAP[biz.slug] || "✨"}</span>
                      <h3 className="mt-2 text-lg font-light text-white">{biz.name}</h3>
                      <p className="mt-1 text-sm text-white/50">{biz.tagline}</p>
                      <span
                        className="mt-4 inline-block text-xs tracking-[0.2em] uppercase transition-colors"
                        style={{ color: biz.theme?.primaryColor || "#fff" }}
                      >
                        Enter World →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="mt-12 text-center text-xs tracking-wider text-white/20">
            More J worlds are coming.
          </p>
        </div>
      </div>
    </div>
  );
}
