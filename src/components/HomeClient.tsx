"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IntroSequence } from "@/components/3d/IntroSequence";
import { CinematicHub } from "@/components/experience/CinematicHub";
import { ScrollJourney } from "@/components/experience/ScrollJourney";
import { MobileJourney } from "@/components/experience/MobileJourney";
import { MasterNav } from "@/components/layout/MasterNav";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { WORLD_LAYOUT } from "@/lib/hub-worlds";
import type { BusinessWithTheme } from "@/lib/types";

interface HomeClientProps {
  businesses: BusinessWithTheme[];
}

type Phase = "intro" | "hub";

export function HomeClient({ businesses }: HomeClientProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [transitionRoute, setTransitionRoute] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    const skipped = sessionStorage.getItem("j-skip-intro");
    if (skipped === "1") setPhase("hub");
  }, []);

  const enterHub = useCallback(() => setPhase("hub"), []);

  const skipIntro = useCallback(() => {
    sessionStorage.setItem("j-skip-intro", "1");
    enterHub();
  }, [enterHub]);

  const handleEnterWorld = useCallback(
    (route: string) => {
      setTransitionRoute(route);
      setTimeout(() => router.push(route), 1200);
    },
    [router]
  );

  const transitionBusiness = businesses.find((b) => b.route === transitionRoute);
  const transitionLayout = transitionBusiness ? WORLD_LAYOUT[transitionBusiness.slug] : null;

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
    <div className="bg-[#050504]">
      <div className="relative min-h-screen w-full">
        <MasterNav transparent />

        <AnimatePresence>
          {phase === "hub" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <CinematicHub businesses={businesses} onEnterWorld={handleEnterWorld} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {transitionRoute && transitionBusiness && transitionLayout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[300] flex items-center justify-center bg-black"
            >
              <motion.div
                initial={{ scale: 1.05, filter: "blur(0px)" }}
                animate={{ scale: 1.3, filter: "blur(14px)" }}
                transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={transitionBusiness.heroImage || transitionLayout.photo}
                  alt=""
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/55" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.75 }}
                className="relative z-10 px-6 text-center"
              >
                <p
                  className="font-[family-name:var(--font-cinzel)] text-4xl tracking-[0.12em] md:text-6xl"
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
