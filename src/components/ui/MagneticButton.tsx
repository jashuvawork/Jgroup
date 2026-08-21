"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "gold" | "outline" | "ghost";
  dataCursor?: string;
}

export function MagneticButton({
  children,
  onClick,
  href,
  className,
  variant = "gold",
  dataCursor,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pressed, setPressed] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const variants = {
    gold: "bg-gradient-to-r from-[#c9a227] via-[#e8d48b] to-[#c9a227] bg-[length:200%_auto] text-black hover:shadow-[0_0_40px_rgba(201,162,39,0.25)]",
    outline: "border border-white/25 text-white/80 hover:border-white/50 hover:text-white",
    ghost: "text-white/50 hover:text-white",
  };

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({ x: (e.clientX - cx) * 0.15, y: (e.clientY - cy) * 0.15 });
  };

  const handleLeave = () => setOffset({ x: 0, y: 0 });

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: offset.x, y: offset.y, scale: pressed ? 0.96 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "btn-premium inline-flex items-center justify-center rounded-full px-10 py-4 text-[10px] font-medium tracking-[0.3em] uppercase transition-shadow duration-500",
        variants[variant],
        className
      )}
      data-cursor={dataCursor}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className="inline-block">
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block border-0 bg-transparent p-0">
      {inner}
    </button>
  );
}
