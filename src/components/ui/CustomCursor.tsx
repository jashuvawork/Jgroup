"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorMode = "default" | "enter" | "taste" | "celebrate" | "impact" | "explore";

const LABELS: Record<CursorMode, string> = {
  default: "",
  enter: "ENTER",
  taste: "TASTE",
  celebrate: "CELEBRATE",
  impact: "IMPACT",
  explore: "EXPLORE",
};

export function CustomCursor() {
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 400, damping: 35 });
  const sy = useSpring(y, { stiffness: 400, damping: 35 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const el = t.closest("[data-cursor]") as HTMLElement | null;
      setMode((el?.dataset.cursor as CursorMode) || "default");
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);
    document.body.addEventListener("mouseleave", leave);
    document.body.addEventListener("mouseenter", enter);
    document.body.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
      document.body.removeEventListener("mouseleave", leave);
      document.body.removeEventListener("mouseenter", enter);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [x, y]);

  if (!visible) return null;

  const active = mode !== "default";
  const size = active ? 72 : 12;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:flex items-center justify-center"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex items-center justify-center rounded-full border border-white/30 bg-white/5 backdrop-blur-sm"
      >
        {active && (
          <span className="text-[8px] tracking-[0.25em] text-white/80">{LABELS[mode]}</span>
        )}
      </motion.div>
    </motion.div>
  );
}
