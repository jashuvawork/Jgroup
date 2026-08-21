"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { IntroSequence } from "@/components/3d/IntroSequence";
import { ScrollJourney } from "@/components/experience/ScrollJourney";
import { MobileJourney } from "@/components/experience/MobileJourney";
import { WorldHoverPanel, DistantLabels } from "@/components/experience/WorldHoverPanel";
import { MasterNav } from "@/components/layout/MasterNav";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { useWebGL } from "@/contexts/WebGLContext";
import type { BusinessWithTheme } from "@/lib/types";

const JWorldHub = dynamic(
  () => import("@/components/3d/JWorldHub").then((m) => m.JWorldHub),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-[#010101]" /> }
);

interface HomeClientProps {
  businesses: BusinessWithTheme[];
}

type Phase = "intro" | "hub";

export function HomeClient({ businesses }: HomeClientProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [hubReady, setHubReady] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { supported, reducedMotion } = useWebGL();
  const router = useRouter();

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    const skipped = sessionStorage.getItem("j-skip-intro");
    if (skipped === "1") setPhase("hub");
  }, []);

  const enterHub = useCallback(() => {
    setPhase("hub");
    setTimeout(() => setHubReady(true), 800);
  }, []);

  const skipIntro = useCallback(() => {
    sessionStorage.setItem("j-skip-intro", "1");
    enterHub();
  }, [enterHub]);

  const handleEnterWorld = useCallback(
    (route: string) => router.push(route),
    [router]
  );

  const hoveredBusiness = businesses.find((b) => b.slug === hoveredSlug) || null;
  const use3D = supported && !reducedMotion && !isMobile;

  if (phase === "intro" && !isMobile) {
    return <IntroSequence onEnter={enterHub} onSkip={skipIntro} />;
  }

  if (isMobile) {
    return (
      <>
        <MobileJourney
          businesses={businesses}
          onEnterWorld={handleEnterWorld}
          onExplore={skipIntro}
        />
        <SoundToggle />
      </>
    );
  }

  return (
    <div className="bg-[#010101]">
      {/* Hub — pinned viewport */}
      <div className="relative h-screen w-full overflow-hidden">
        <MasterNav transparent />

        <AnimatePresence>
          {phase === "hub" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              {use3D ? (
                <JWorldHub
                  businesses={businesses}
                  onEnterWorld={handleEnterWorld}
                  onHoverWorld={setHoveredSlug}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-[family-name:var(--font-cinzel)] text-[10rem] text-gradient-gold">J</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <DistantLabels businesses={businesses} visible={hubReady && !hoveredSlug} />

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <WorldHoverPanel business={hoveredBusiness} onExplore={handleEnterWorld} />
        </div>

        {!hoveredSlug && hubReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-0 right-0 z-10 text-center"
          >
            <p className="text-[9px] tracking-[0.45em] uppercase text-white/25">
              Scroll to explore worlds
            </p>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mx-auto mt-3 h-6 w-px bg-white/20"
            />
          </motion.div>
        )}

        <SoundToggle />
      </div>

      {/* Cinematic scroll journey */}
      <ScrollJourney businesses={businesses} onEnterWorld={handleEnterWorld} />
    </div>
  );
}
