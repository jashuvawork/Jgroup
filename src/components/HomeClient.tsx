"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import { IntroSequence } from "@/components/3d/IntroSequence";
import { Fallback2D } from "@/components/3d/Fallback2D";
import { MasterNav } from "@/components/layout/MasterNav";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { SectionLabel } from "@/components/ui/Premium";
import { useWebGL } from "@/contexts/WebGLContext";
import type { BusinessWithTheme } from "@/lib/types";

const JWorldHub = dynamic(
  () => import("@/components/3d/JWorldHub").then((m) => m.JWorldHub),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-[#030303]" /> }
);

const EMOJI_MAP: Record<string, string> = {
  "j-surprise-events": "🎉",
  "j-foods": "🍽️",
  "j-foundation": "❤️",
};

interface HomeClientProps {
  businesses: BusinessWithTheme[];
}

export function HomeClient({ businesses }: HomeClientProps) {
  const [introComplete, setIntroComplete] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { supported, reducedMotion } = useWebGL();
  const router = useRouter();

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    setTimeout(() => setShowExplore(true), 600);
  }, []);

  const handleEnterWorld = useCallback(
    (route: string) => router.push(route),
    [router]
  );

  const use3D = supported && !reducedMotion;

  if (!introComplete) {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }

  if (!use3D) {
    return (
      <>
        <MasterNav transparent />
        <Fallback2D businesses={businesses} />
        <SoundToggle />
      </>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#030303]">
      <MasterNav transparent />
      <JWorldHub businesses={businesses} onEnterWorld={handleEnterWorld} />

      {showExplore && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        >
          <div className="bg-gradient-to-t from-[#030303] via-[#030303]/95 to-transparent px-6 pb-10 pt-40">
            <div id="explore" className="pointer-events-auto mx-auto max-w-5xl">
              <SectionLabel>Explore J</SectionLabel>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {businesses.map((biz, i) => (
                  <motion.button
                    key={biz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.6 }}
                    onClick={() => handleEnterWorld(biz.route)}
                    onMouseEnter={() => setHoveredCard(biz.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="card-glow group relative overflow-hidden rounded-2xl p-5 text-left"
                    style={{
                      background: hoveredCard === biz.id
                        ? `linear-gradient(135deg, ${biz.theme?.primaryColor}18, transparent)`
                        : undefined,
                    }}
                  >
                    {biz.heroImage && (
                      <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
                        <Image src={biz.heroImage} alt="" fill className="object-cover" sizes="300px" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent" />
                      </div>
                    )}

                    <div className="relative">
                      <span className="text-xl">{EMOJI_MAP[biz.slug] || "✨"}</span>
                      <p className="mt-3 font-[family-name:var(--font-cinzel)] text-sm tracking-wide text-white">
                        {biz.name}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-white/40">
                        {biz.tagline}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span
                          className="text-[9px] tracking-[0.25em] uppercase transition-colors"
                          style={{ color: biz.theme?.primaryColor || "#c9a227" }}
                        >
                          Enter World
                        </span>
                        <motion.span
                          animate={{ x: hoveredCard === biz.id ? 4 : 0 }}
                          className="text-[10px]"
                          style={{ color: biz.theme?.primaryColor || "#c9a227" }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-10 text-center text-[9px] tracking-[0.4em] uppercase text-white/15"
              >
                More J worlds are coming
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}

      <SoundToggle />
    </div>
  );
}
