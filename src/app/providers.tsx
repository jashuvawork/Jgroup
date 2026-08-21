"use client";

import { SessionProvider } from "next-auth/react";
import { SoundProvider } from "@/contexts/SoundContext";
import { WebGLProvider } from "@/contexts/WebGLContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WebGLProvider>
        <SoundProvider>{children}</SoundProvider>
      </WebGLProvider>
    </SessionProvider>
  );
}
