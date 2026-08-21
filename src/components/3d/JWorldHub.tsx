"use client";

import { Suspense, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Environment } from "@react-three/drei";
import * as THREE from "three";
import { CentralJ } from "./CentralJ";
import { WorldPortal } from "./WorldPortal";
import type { BusinessWithTheme } from "@/lib/types";

const WORLD_CONFIG: Record<string, { emoji: string; position: [number, number, number] }> = {
  "j-surprise-events": { emoji: "🎉", position: [-5, 1, -2] },
  "j-foods": { emoji: "🍽️", position: [5, 0, -1] },
  "j-foundation": { emoji: "❤️", position: [0, -1, -5] },
};

function CameraController() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    target.current.x = pointer.x * 0.5;
    target.current.y = pointer.y * 0.3;
    camera.position.x += (target.current.x - camera.position.x) * 0.02;
    camera.position.y += (target.current.y + 1 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface JWorldHubProps {
  businesses: BusinessWithTheme[];
  onEnterWorld: (route: string) => void;
}

function Scene({ businesses, onEnterWorld }: JWorldHubProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 8, 25]} />
      <Stars radius={50} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />
      <Environment preset="night" />
      <CameraController />
      <CentralJ />

      {businesses.map((biz) => {
        const config = WORLD_CONFIG[biz.slug] || {
          emoji: "✨",
          position: [0, 0, -3] as [number, number, number],
        };
        return (
          <WorldPortal
            key={biz.id}
            position={config.position}
            name={biz.name.replace("J ", "")}
            emoji={config.emoji}
            color={biz.theme?.primaryColor || "#ffffff"}
            secondaryColor={biz.theme?.secondaryColor || "#a78bfa"}
            onClick={() => onEnterWorld(biz.route)}
            onHover={(h) => setHoveredId(h ? biz.id : null)}
          />
        );
      })}

      {hoveredId && (
        <mesh position={[0, -4, 0]}>
          <planeGeometry args={[0.01, 0.01]} />
        </mesh>
      )}
    </>
  );
}

export function JWorldHub({ businesses, onEnterWorld }: JWorldHubProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 1, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Scene businesses={businesses} onEnterWorld={onEnterWorld} />
        </Suspense>
      </Canvas>
    </div>
  );
}
