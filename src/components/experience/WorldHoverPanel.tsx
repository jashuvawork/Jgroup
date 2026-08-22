"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WORLD_LAYOUT } from "@/lib/hub-worlds";
import type { BusinessWithTheme } from "@/lib/types";

interface WorldHoverPanelProps {
  business: BusinessWithTheme | null;
  onExplore: (route: string) => void;
}

export function WorldHoverPanel({ business, onExplore }: WorldHoverPanelProps) {
  const layout = business ? WORLD_LAYOUT[business.slug] : null;

  return (
    <AnimatePresence>
      {business && layout && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="pointer-events-auto absolute bottom-[18%] left-1/2 z-20 w-full max-w-2xl -translate-x-1/2 px-6 text-center md:bottom-[22%]"
        >
          <p
            className="font-[family-name:var(--font-cinzel)] text-4xl font-medium tracking-[0.15em] text-white md:text-6xl"
            style={{ color: layout.accent }}
          >
            {layout.label}
          </p>
          <p className="mt-4 text-lg font-light tracking-wide text-white/55 md:text-xl">
            {layout.tagline}
          </p>
          <button
            onClick={() => onExplore(business.route)}
            className="mt-8 text-xs tracking-[0.4em] uppercase text-white/70 transition-colors hover:text-white"
            data-cursor="explore"
          >
            Enter →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface HubMasterCopyProps {
  visible: boolean;
}

export function HubMasterCopy({ visible }: HubMasterCopyProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="pointer-events-none absolute left-1/2 top-[12%] z-10 -translate-x-1/2 text-center"
        >
          <p className="font-[family-name:var(--font-cinzel)] text-5xl font-medium text-gradient-gold md:text-7xl">
            J
          </p>
          <p className="mt-4 text-xs tracking-[0.55em] text-white/45 md:text-sm">
            ONE VISION.
          </p>
          <p className="mt-2 text-xs tracking-[0.55em] text-white/30 md:text-sm">
            MANY POSSIBILITIES.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FutureWorldLabelProps {
  visible: boolean;
}

export function FutureWorldLabel({ visible }: FutureWorldLabelProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute bottom-[32%] right-[8%] z-10 text-right md:right-[12%]"
        >
          <p className="text-[10px] tracking-[0.35em] text-white/50">MORE J WORLDS</p>
          <p className="mt-1 text-[9px] tracking-[0.25em] text-white/25">Coming soon.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
