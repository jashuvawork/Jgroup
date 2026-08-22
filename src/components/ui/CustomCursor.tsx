"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [interactive, setInteractive] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });

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
      const el = t.closest("a, button, [data-cursor], [role='button']");
      setInteractive(!!el);
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

  const size = interactive ? 36 : 8;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="rounded-full border border-white/25 bg-white/[0.04]"
      />
    </motion.div>
  );
}
