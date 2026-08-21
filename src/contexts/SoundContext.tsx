"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface SoundContextType {
  enabled: boolean;
  toggle: () => void;
}

const SoundContext = createContext<SoundContextType>({
  enabled: false,
  toggle: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const toggle = useCallback(() => setEnabled((e) => !e), []);
  return (
    <SoundContext.Provider value={{ enabled, toggle }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
