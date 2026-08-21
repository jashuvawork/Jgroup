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
        "fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full",
        "border border-white/10 bg-black/40 backdrop-blur-md transition-all hover:bg-white/10",
        className
      )}
    >
      {enabled ? (
        <Volume2 className="h-4 w-4 text-white/70" />
      ) : (
        <VolumeX className="h-4 w-4 text-white/40" />
      )}
    </button>
  );
}
