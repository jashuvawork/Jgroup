"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Environment, Cloud } from "@react-three/drei";
import * as THREE from "three";
import { CentralJ } from "./CentralJ";
import { WorldPortal } from "./WorldPortal";
import type { BusinessWithTheme } from "@/lib/types";

const WORLD_CONFIG: Record<string, { emoji: string; position: [number, number, number]; shape: "sphere" | "torus" | "octahedron" }> = {
  "j-surprise-events": { emoji: "🎉", position: [-5.5, 1.2, -1], shape: "torus" },
  "j-foods": { emoji: "🍽️", position: [5.5, 0.5, -0.5], shape: "sphere" as const },
  "j-foundation": { emoji: "❤️", position: [0, -0.8, -5.5], shape: "octahedron" },
};

function CameraController() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3());
  const basePos = useRef(new THREE.Vector3(0, 0.5, 9));

  useFrame(() => {
    target.current.x = pointer.x * 0.8;
    target.current.y = pointer.y * 0.5;
    camera.position.x += (basePos.current.x + target.current.x - camera.position.x) * 0.025;
    camera.position.y += (basePos.current.y + target.current.y - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function NebulaFog() {
  return (
    <>
      <Cloud opacity={0.08} speed={0.1} bounds={[15, 2, 15]} segments={20} position={[0, -3, -8]} color="#8b5cf6" />
      <Cloud opacity={0.05} speed={0.08} bounds={[12, 2, 12]} segments={15} position={[5, 2, -6]} color="#c9a227" />
    </>
  );
}

interface JWorldHubProps {
  businesses: BusinessWithTheme[];
  onEnterWorld: (route: string) => void;
}

function Scene({ businesses, onEnterWorld }: JWorldHubProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      <color attach="background" args={["#030303"]} />
      <fog attach="fog" args={["#030303", 10, 30]} />
      <Stars radius={80} depth={60} count={3000} factor={4} saturation={0.1} fade speed={0.3} />
      <Environment preset="night" />
      <NebulaFog />
      <CameraController />
      <CentralJ />

      {businesses.map((biz) => {
        const config = WORLD_CONFIG[biz.slug] || {
          emoji: "✨",
          position: [0, 0, -3] as [number, number, number],
          shape: "sphere" as const,
        };
        return (
          <WorldPortal
            key={biz.id}
            position={config.position}
            name={biz.name.replace("J ", "")}
            emoji={config.emoji}
            color={biz.theme?.primaryColor || "#8b5cf6"}
            secondaryColor={biz.theme?.accentColor || biz.theme?.secondaryColor || "#c9a227"}
            shape={config.shape}
            onClick={() => onEnterWorld(biz.route)}
            onHover={(h) => setHoveredId(h ? biz.id : null)}
          />
        );
      })}

      {/* Subtle floor reflection */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.02} />
      </mesh>

      {hoveredId && null}
    </>
  );
}

export function JWorldHub({ businesses, onEnterWorld }: JWorldHubProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0.5, 9], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene businesses={businesses} onEnterWorld={onEnterWorld} />
        </Suspense>
      </Canvas>

      {/* Vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,3,3,0.6) 100%)",
        }}
      />
    </div>
  );
}
