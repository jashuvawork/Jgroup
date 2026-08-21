"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { CentralJ } from "./CentralJ";
import { WorldPortal } from "./WorldPortal";
import type { BusinessWithTheme } from "@/lib/types";

const WORLD_CONFIG: Record<string, { position: [number, number, number] }> = {
  "j-surprise-events": { position: [-5.5, 0.8, 0] },
  "j-foods": { position: [5.5, 0.5, 0] },
  "j-foundation": { position: [0, 0.2, -5.5] },
};

function CameraController() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    target.current.x = pointer.x * 0.25;
    target.current.y = pointer.y * 0.15;
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (0.4 + target.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface JWorldHubProps {
  businesses: BusinessWithTheme[];
  onEnterWorld: (route: string) => void;
  onHoverWorld?: (slug: string | null) => void;
}

function Scene({ businesses, onEnterWorld, onHoverWorld }: JWorldHubProps) {
  return (
    <>
      <color attach="background" args={["#020202"]} />
      <fog attach="fog" args={["#020202", 12, 35]} />

      <Environment preset="city" background={false} environmentIntensity={0.4} />
      <Stars radius={100} depth={80} count={4000} factor={3} saturation={0.05} fade speed={0.2} />

      <CameraController />
      <CentralJ />

      {businesses.map((biz) => {
        const config = WORLD_CONFIG[biz.slug] || { position: [0, 0, -4] as [number, number, number] };
        return (
          <WorldPortal
            key={biz.id}
            position={config.position}
            name={biz.name.replace("J ", "")}
            color={biz.theme?.primaryColor || "#8b5cf6"}
            secondaryColor={biz.theme?.secondaryColor || "#e9d5ff"}
            accentColor={biz.theme?.accentColor || biz.theme?.primaryColor || "#c9a227"}
            heroImage={biz.heroImage}
            onClick={() => onEnterWorld(biz.route)}
            onHover={(h) => onHoverWorld?.(h ? biz.slug : null)}
          />
        );
      })}

      <ContactShadows
        position={[0, -2.35, 0]}
        opacity={0.35}
        scale={14}
        blur={2.5}
        far={5}
        color="#000000"
      />

      <EffectComposer>
        <Bloom
          intensity={0.35}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.6} />
      </EffectComposer>
    </>
  );
}

export function JWorldHub({ businesses, onEnterWorld, onHoverWorld }: JWorldHubProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0.4, 10], fov: 50 }}
        dpr={[1, 2]}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <Suspense fallback={null}>
          <Scene businesses={businesses} onEnterWorld={onEnterWorld} onHoverWorld={onHoverWorld} />
        </Suspense>
      </Canvas>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(2,2,2,0.55) 100%)",
        }}
      />
    </div>
  );
}
