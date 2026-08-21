"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useWebGL } from "@/contexts/WebGLContext";

const IntroJ3D = dynamic(() => import("./IntroJ3D").then((m) => m.IntroJ3D), {
  ssr: false,
});

interface IntroSequenceProps {
  onEnter: () => void;
  onSkip: () => void;
}

export function IntroSequence({ onEnter, onSkip }: IntroSequenceProps) {
  const [stage, setStage] = useState(0);
  const [exiting, setExiting] = useState(false);
  const { supported, reducedMotion } = useWebGL();
  const use3D = supported && !reducedMotion;

  useEffect(() => {
    if (reducedMotion) {
      setStage(4);
      return;
    }
    const timers = [
      setTimeout(() => setStage(1), 1000),
      setTimeout(() => setStage(2), 2600),
      setTimeout(() => setStage(3), 4000),
      setTimeout(() => setStage(4), 5400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [reducedMotion]);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-[#010101]">
      {use3D && <IntroJ3D />}

      {/* Hero J — Cinzel display, stable (no shake) */}
      <div className="pointer-events-none absolute inset-0 z-[15] flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
          className="intro-j-letter font-[family-name:var(--font-cinzel)] text-[11rem] font-semibold leading-none tracking-tight text-gradient-gold md:text-[15rem]"
          aria-hidden
        >
          J
        </motion.span>
      </div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, #010101 85%)" }}
      />

      <AnimatePresence>
        {!exiting && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="relative z-20 flex min-h-screen flex-col items-center justify-end pb-24 md:justify-center md:pb-0"
          >
            <div className="mt-auto flex flex-col items-center px-6 md:mt-[38vh]">
              <AnimatePresence mode="wait">
                {stage >= 2 && (
                  <motion.p
                    key="vision"
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center font-[family-name:var(--font-cinzel)] text-sm tracking-[0.6em] text-white/70 md:text-base"
                  >
                    ONE VISION.
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {stage >= 3 && (
                  <motion.p
                    key="possibilities"
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                    className="mt-4 text-center font-[family-name:var(--font-cinzel)] text-sm tracking-[0.6em] text-white/50 md:text-base"
                  >
                    MANY POSSIBILITIES.
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {stage >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-14 flex flex-col items-center gap-6"
                  >
                    <MagneticButton onClick={handleEnter} dataCursor="enter">
                      Enter J Space →
                    </MagneticButton>
                    <button
                      onClick={onSkip}
                      className="text-[9px] tracking-[0.35em] uppercase text-white/25 transition-colors hover:text-white/50"
                      data-cursor="explore"
                    >
                      Skip intro
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {exiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 bg-[#010101]"
          transition={{ duration: 1.2 }}
        />
      )}
    </div>
  );
}
