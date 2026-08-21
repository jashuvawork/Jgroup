"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { IntroSequence } from "@/components/3d/IntroSequence";
import { Fallback2D } from "@/components/3d/Fallback2D";
import { MasterNav } from "@/components/layout/MasterNav";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { useWebGL } from "@/contexts/WebGLContext";
import type { BusinessWithTheme } from "@/lib/types";

const JWorldHub = dynamic(
  () => import("@/components/3d/JWorldHub").then((m) => m.JWorldHub),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-black" /> }
);

interface HomeClientProps {
  businesses: BusinessWithTheme[];
}

export function HomeClient({ businesses }: HomeClientProps) {
  const [introComplete, setIntroComplete] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const { supported, reducedMotion } = useWebGL();
  const router = useRouter();

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    setTimeout(() => setShowExplore(true), 500);
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
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <MasterNav transparent />
      <JWorldHub businesses={businesses} onEnterWorld={handleEnterWorld} />

      {showExplore && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        >
          <div className="bg-gradient-to-t from-black via-black/80 to-transparent px-6 pb-12 pt-32">
            <div id="explore" className="pointer-events-auto mx-auto max-w-4xl text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-white/40">
                Explore J
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {businesses.map((biz) => (
                  <button
                    key={biz.id}
                    onClick={() => handleEnterWorld(biz.route)}
                    className="group rounded-xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                  >
                    <p className="text-sm font-light text-white">{biz.name}</p>
                    <p className="mt-1 text-xs text-white/40">{biz.tagline}</p>
                    <span className="mt-2 inline-block text-[10px] tracking-[0.2em] uppercase text-white/30 group-hover:text-white/60">
                      Enter World
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-8 text-[10px] tracking-wider text-white/20">
                More J worlds are coming.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <SoundToggle />
    </div>
  );
}
