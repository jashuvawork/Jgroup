"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface IntroSequenceProps {
  onEnter: () => void;
  onSkip: () => void;
}

export function IntroSequence({ onEnter, onSkip }: IntroSequenceProps) {
  const [stage, setStage] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 2200),
      setTimeout(() => setStage(3), 3600),
      setTimeout(() => setStage(4), 4800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-[#050504]">
      {/* Cinematic ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(201,162,39,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#050504_90%)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[15] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1] }}
          className="hub-j-hero-wrap text-center"
        >
          <span className="hub-j-hero font-[family-name:var(--font-cinzel)] text-[10rem] font-semibold leading-none md:text-[14rem]">
            J
          </span>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "radial-gradient(ellipse at center, transparent 35%, #050504 88%)" }}
      />

      <AnimatePresence>
        {!exiting && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-20 flex min-h-screen flex-col items-center justify-end pb-24 md:justify-center md:pb-0"
          >
            <div className="mt-auto flex flex-col items-center px-6 md:mt-[42vh]">
              <AnimatePresence>
                {stage >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center text-[11px] tracking-[0.55em] text-white/55 md:text-xs"
                  >
                    ONE VISION.
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {stage >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="mt-3 text-center text-[11px] tracking-[0.55em] text-white/35 md:text-xs"
                  >
                    MANY POSSIBILITIES.
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {stage >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
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
          className="absolute inset-0 z-30 bg-[#050504]"
          transition={{ duration: 1 }}
        />
      )}
    </div>
  );
}
