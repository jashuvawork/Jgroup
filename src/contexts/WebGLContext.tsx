"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface WebGLContextType {
  supported: boolean;
  reducedMotion: boolean;
}

const WebGLContext = createContext<WebGLContextType>({
  supported: true,
  reducedMotion: false,
});

export function WebGLProvider({ children }: { children: ReactNode }) {
  const [supported, setSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <WebGLContext.Provider value={{ supported, reducedMotion }}>
      {children}
    </WebGLContext.Provider>
  );
}

export const useWebGL = () => useContext(WebGLContext);
