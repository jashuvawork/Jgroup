"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface WebGLContextType {
  supported: boolean;
  reducedMotion: boolean;
  lowEnd: boolean;
}

const WebGLContext = createContext<WebGLContextType>({
  supported: true,
  reducedMotion: false,
  lowEnd: false,
});

function detectLowEnd(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return coarse || cores <= 4 || memory <= 4;
}

export function WebGLProvider({ children }: { children: ReactNode }) {
  const [supported, setSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowEnd, setLowEnd] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }

    setLowEnd(detectLowEnd());

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <WebGLContext.Provider value={{ supported, reducedMotion, lowEnd }}>
      {children}
    </WebGLContext.Provider>
  );
}

export const useWebGL = () => useContext(WebGLContext);
