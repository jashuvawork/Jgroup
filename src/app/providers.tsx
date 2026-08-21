"use client";

import { SessionProvider } from "next-auth/react";
import { SoundProvider } from "@/contexts/SoundContext";
import { WebGLProvider } from "@/contexts/WebGLContext";
import { CustomCursor } from "@/components/ui/CustomCursor";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WebGLProvider>
        <SoundProvider>
          <CustomCursor />
          {children}
        </SoundProvider>
      </WebGLProvider>
    </SessionProvider>
  );
}
