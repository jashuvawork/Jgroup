"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroSequenceProps {
  onComplete: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [stage, setStage] = useState(0);

  const particles = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 60,
        y: 50 + (Math.random() - 0.5) * 60,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
      })),
    []
  );

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 600),
      setTimeout(() => setStage(2), 1800),
      setTimeout(() => setStage(3), 3200),
      setTimeout(() => setStage(4), 4200),
      setTimeout(() => onComplete(), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#030303]">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute left-1/3 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/8 blur-[100px]" />
      </div>

      {/* Radial light rays */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(139,92,246,0.08) 60deg, transparent 120deg, rgba(201,162,39,0.06) 180deg, transparent 240deg, rgba(139,92,246,0.08) 300deg, transparent 360deg)",
        }}
      />

      <AnimatePresence mode="wait">
        {stage < 4 && (
          <motion.div
            key="intro"
            className="relative flex flex-col items-center"
            exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
            transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Particle convergence */}
            {stage >= 1 && stage < 3 && (
              <div className="absolute inset-0 flex items-center justify-center">
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-white"
                    style={{ width: p.size, height: p.size }}
                    initial={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      opacity: 0,
                    }}
                    animate={{
                      left: "50%",
                      top: "50%",
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: p.duration,
                      delay: p.delay,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  />
                ))}
              </div>
            )}

            {/* J Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, filter: "blur(30px)" }}
              animate={
                stage >= 1
                  ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                  : {}
              }
              transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative"
            >
              {/* Glow rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="h-48 w-48 rounded-full border border-white/10 md:h-64 md:w-64"
                />
                <motion.div
                  animate={{ scale: [1.1, 1.25, 1.1], opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                  className="absolute h-64 w-64 rounded-full border border-violet-400/20 md:h-80 md:w-80"
                />
              </div>

              <span className="relative font-[family-name:var(--font-cinzel)] text-[10rem] font-medium leading-none tracking-[0.15em] text-gradient-gold md:text-[14rem]">
                J
              </span>

              {/* Inner glow */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-amber-500/30 via-violet-500/20 to-transparent blur-3xl" />
            </motion.div>

            {stage >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="mt-10 flex flex-col items-center gap-3"
              >
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                <p className="text-[10px] tracking-[0.5em] uppercase text-white/40">
                  One Vision. Many Possibilities.
                </p>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
              </motion.div>
            )}

            {stage >= 3 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mt-8 text-[9px] tracking-[0.6em] uppercase text-white/20"
              >
                Entering the world of J
              </motion.p>
            )}
          </motion.div>
        )}

        {stage === 4 && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#030303]"
            transition={{ duration: 1.2 }}
          />
        )}
      </AnimatePresence>

      {/* Floating dust */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1 + Math.random(),
              height: 1 + Math.random(),
              background: i % 3 === 0 ? "rgba(201,162,39,0.4)" : "rgba(255,255,255,0.2)",
            }}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.7, 0],
              y: [`${Math.random() * 100}%`, `${Math.random() * 60}%`],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
