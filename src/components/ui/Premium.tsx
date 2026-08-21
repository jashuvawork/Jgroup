"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  accent?: string;
  className?: string;
}

export function SectionLabel({ children, accent, className }: SectionLabelProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="h-px w-12 origin-center"
        style={{ background: accent ? `linear-gradient(90deg, transparent, ${accent}, transparent)` : "linear-gradient(90deg, transparent, #c9a227, transparent)" }}
      />
      <p
        className="text-[10px] tracking-[0.45em] uppercase"
        style={{ color: accent || "rgba(255,255,255,0.35)" }}
      >
        {children}
      </p>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="h-px w-12 origin-center"
        style={{ background: accent ? `linear-gradient(90deg, transparent, ${accent}40, transparent)` : "linear-gradient(90deg, transparent, rgba(201,162,39,0.25), transparent)" }}
      />
    </div>
  );
}

interface AmbientOrbsProps {
  colors?: string[];
}

export function AmbientOrbs({ colors = ["#8b5cf6", "#c9a227", "#1e40af"] }: AmbientOrbsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {colors.map((color, i) => (
        <div
          key={i}
          className="ambient-orb"
          style={{
            background: color,
            opacity: 0.12,
            width: `${300 + i * 100}px`,
            height: `${300 + i * 100}px`,
            top: `${10 + i * 25}%`,
            left: `${5 + i * 30}%`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

interface PremiumButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "gold" | "outline" | "ghost";
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export function PremiumButton({ children, href, onClick, variant = "gold", color, className, style, id }: PremiumButtonProps) {
  const base = "btn-premium inline-flex items-center justify-center rounded-full px-8 py-3.5 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500";
  const variants = {
    gold: "bg-gradient-to-r from-[#c9a227] via-[#e8d48b] to-[#c9a227] bg-[length:200%_auto] text-black hover:shadow-[0_0_40px_rgba(201,162,39,0.3)] hover:scale-[1.02]",
    outline: "border border-white/20 text-white/80 hover:border-white/40 hover:text-white hover:bg-white/5",
    ghost: "text-white/60 hover:text-white",
  };

  const mergedStyle: React.CSSProperties | undefined =
    color && variant === "outline"
      ? { borderColor: `${color}40`, color, ...style }
      : style;
  const cls = cn(base, variants[variant], className);

  if (href) {
    return (
      <a href={href} id={id} className={cls} style={mergedStyle}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} id={id} className={cls} style={mergedStyle}>
      {children}
    </button>
  );
}
