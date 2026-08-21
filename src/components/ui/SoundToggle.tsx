"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/contexts/SoundContext";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useSound();

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Mute sound" : "Enable sound"}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full",
        "border border-white/[0.08] bg-[#030303]/60 backdrop-blur-xl transition-all duration-500",
        "hover:border-amber-400/30 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(201,162,39,0.15)]",
        className
      )}
    >
      {enabled ? (
        <Volume2 className="h-4 w-4 text-amber-400/70" />
      ) : (
        <VolumeX className="h-4 w-4 text-white/30" />
      )}
    </button>
  );
}
