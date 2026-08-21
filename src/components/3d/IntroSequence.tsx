"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroSequenceProps {
  onComplete: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 2000),
      setTimeout(() => setStage(3), 3500),
      setTimeout(() => onComplete(), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <AnimatePresence mode="wait">
        {stage < 3 && (
          <motion.div
            key="intro"
            className="flex flex-col items-center"
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
              animate={
                stage >= 1
                  ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                  : {}
              }
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative"
            >
              <span className="text-[12rem] font-extralight leading-none tracking-[0.2em] text-white md:text-[16rem]">
                J
              </span>
              <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-purple-500/20 to-transparent blur-3xl" />
            </motion.div>

            {stage >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-8 text-xs tracking-[0.4em] uppercase text-white/50"
              >
                One Vision. Many Possibilities.
              </motion.p>
            )}
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black"
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Particle overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/30"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [`${Math.random() * 100}%`, `${Math.random() * 100 - 20}%`],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
