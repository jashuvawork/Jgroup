"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { BusinessWithTheme } from "@/lib/types";

const META: Record<string, { line: string; cursor: string }> = {
  "j-surprise-events": { line: "Make moments unforgettable.", cursor: "celebrate" },
  "j-foods": { line: "Taste the tradition.", cursor: "taste" },
  "j-foundation": { line: "Create an impact that matters.", cursor: "impact" },
};

interface WorldHoverPanelProps {
  business: BusinessWithTheme | null;
  onExplore: (route: string) => void;
}

export function WorldHoverPanel({ business, onExplore }: WorldHoverPanelProps) {
  const meta = business ? META[business.slug] : null;

  return (
    <AnimatePresence>
      {business && meta && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto absolute left-1/2 top-1/2 z-20 -translate-x-1/2 translate-y-16 text-center"
        >
          <motion.p
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="font-[family-name:var(--font-cinzel)] text-2xl tracking-[0.2em] text-white md:text-3xl"
          >
            {business.name.replace("J ", "").toUpperCase()}
          </motion.p>
          <p className="mt-3 text-sm font-light tracking-wide text-white/50">{meta.line}</p>
          <button
            onClick={() => onExplore(business.route)}
            className="mt-6 text-[10px] tracking-[0.35em] uppercase transition-colors hover:text-amber-400"
            style={{ color: business.theme?.primaryColor || "#c9a227" }}
            data-cursor={meta.cursor}
          >
            Explore →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DistantLabelsProps {
  businesses: BusinessWithTheme[];
  visible: boolean;
}

export function DistantLabels({ businesses, visible }: DistantLabelsProps) {
  const positions = [
    "left-[8%] top-[35%]",
    "right-[8%] top-[40%]",
    "left-1/2 bottom-[28%] -translate-x-1/2",
  ];

  return (
    <AnimatePresence>
      {visible &&
        businesses.map((biz, i) => (
          <motion.p
            key={biz.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 + i * 0.4, duration: 1 }}
            className={`pointer-events-none absolute z-10 text-[8px] tracking-[0.4em] uppercase text-white/40 ${positions[i] || ""}`}
          >
            {biz.name}
          </motion.p>
        ))}
    </AnimatePresence>
  );
}
