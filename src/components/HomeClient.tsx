"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IntroSequence } from "@/components/3d/IntroSequence";
import { ScrollJourney } from "@/components/experience/ScrollJourney";
import { MobileJourney } from "@/components/experience/MobileJourney";
import {
  WorldHoverPanel,
  HubMasterCopy,
  FutureWorldLabel,
} from "@/components/experience/WorldHoverPanel";
import { MasterNav } from "@/components/layout/MasterNav";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { useWebGL } from "@/contexts/WebGLContext";
import { WORLD_LAYOUT } from "@/lib/hub-worlds";
import type { BusinessWithTheme } from "@/lib/types";

const JWorldHub = dynamic(
  () => import("@/components/3d/JWorldHub").then((m) => m.JWorldHub),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-[#080807]" /> }
);

interface HomeClientProps {
  businesses: BusinessWithTheme[];
}

type Phase = "intro" | "hub";

export function HomeClient({ businesses }: HomeClientProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [hubReady, setHubReady] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [focusSlug, setFocusSlug] = useState<string | null>(null);
  const [transitionRoute, setTransitionRoute] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { supported, reducedMotion, lowEnd } = useWebGL();
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
    (route: string) => {
      const slug = businesses.find((b) => b.route === route)?.slug;
      if (slug && supported && !reducedMotion && !isMobile) {
        setFocusSlug(slug);
        setTransitionRoute(route);
        setTimeout(() => router.push(route), 1400);
      } else {
        router.push(route);
      }
    },
    [businesses, supported, reducedMotion, isMobile, router]
  );

  const hoveredBusiness = businesses.find((b) => b.slug === hoveredSlug) || null;
  const transitionBusiness = businesses.find((b) => b.route === transitionRoute);
  const transitionLayout = transitionBusiness ? WORLD_LAYOUT[transitionBusiness.slug] : null;
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
    <div className="bg-[#080807]">
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
                  hoveredSlug={hoveredSlug}
                  focusSlug={focusSlug}
                  lowEnd={lowEnd}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#080807]">
                  <span className="font-[family-name:var(--font-cinzel)] text-[10rem] text-gradient-gold">J</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <HubMasterCopy visible={hubReady && !hoveredSlug && !focusSlug} />
        <FutureWorldLabel visible={hubReady && !hoveredSlug && !focusSlug} />

        <div className="pointer-events-none absolute inset-0 z-10">
          <WorldHoverPanel business={hoveredBusiness} onExplore={handleEnterWorld} />
        </div>

        {!hoveredSlug && !focusSlug && hubReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-10 left-0 right-0 z-10 text-center"
          >
            <p className="text-[9px] tracking-[0.45em] uppercase text-white/20">
              Hover a destination to explore
            </p>
          </motion.div>
        )}

        {/* Cinematic world entry transition */}
        <AnimatePresence>
          {transitionRoute && transitionBusiness && transitionLayout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] flex items-center justify-center bg-black"
            >
              <motion.div
                initial={{ scale: 1.1, filter: "blur(0px)" }}
                animate={{ scale: 1.35, filter: "blur(12px)" }}
                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={transitionBusiness.heroImage || transitionLayout.photo}
                  alt=""
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/50" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative z-10 text-center px-6"
              >
                <p
                  className="font-[family-name:var(--font-cinzel)] text-4xl tracking-[0.15em] md:text-6xl"
                  style={{ color: transitionLayout.accent }}
                >
                  {transitionLayout.label}
                </p>
                <p className="mt-4 text-lg text-white/60 md:text-xl">{transitionLayout.tagline}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <SoundToggle />
      </div>

      <ScrollJourney businesses={businesses} onEnterWorld={handleEnterWorld} />
    </div>
  );
}
