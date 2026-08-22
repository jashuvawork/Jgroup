"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, DepthOfField } from "@react-three/postprocessing";
import * as THREE from "three";
import { CentralJ } from "./CentralJ";
import { HeadquartersArchitecture } from "./HeadquartersArchitecture";
import { WorldEnvironment, FutureWorldEnvironment } from "./WorldEnvironment";
import { WORLD_LAYOUT, FUTURE_WORLD } from "@/lib/hub-worlds";
import type { BusinessWithTheme } from "@/lib/types";

const BASE_CAMERA = new THREE.Vector3(0, 1.4, 11.5);
const LOOK_AT = new THREE.Vector3(0, 0.2, 0);

function CameraController({
  hoveredSlug,
  focusSlug,
}: {
  hoveredSlug: string | null;
  focusSlug: string | null;
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const drift = useRef(0);

  const hoverOffset = useMemo(() => {
    if (!hoveredSlug || !WORLD_LAYOUT[hoveredSlug]) return new THREE.Vector3();
    const f = WORLD_LAYOUT[hoveredSlug].cameraFocus;
    return new THREE.Vector3(f[0], f[1], f[2]);
  }, [hoveredSlug]);

  const focusOffset = useMemo(() => {
    if (!focusSlug || !WORLD_LAYOUT[focusSlug]) return new THREE.Vector3();
    const layout = WORLD_LAYOUT[focusSlug];
    return new THREE.Vector3(
      layout.position[0] * 0.55,
      layout.position[1] + 0.8,
      layout.position[2] * 0.55 + 4
    );
  }, [focusSlug]);

  useFrame((state) => {
    drift.current = state.clock.elapsedTime;

    if (focusSlug) {
      targetPos.current.copy(focusOffset);
    } else if (hoveredSlug) {
      targetPos.current.set(
        hoverOffset.x,
        BASE_CAMERA.y + hoverOffset.y * 0.3,
        BASE_CAMERA.z + hoverOffset.z
      );
    } else {
      const t = drift.current;
      targetPos.current.set(
        state.pointer.x * 0.2 + Math.sin(t * 0.08) * 0.05,
        BASE_CAMERA.y + state.pointer.y * 0.1,
        BASE_CAMERA.z + Math.sin(t * 0.06) * 0.08
      );
    }

    const lerp = focusSlug ? 0.035 : hoveredSlug ? 0.03 : 0.025;
    camera.position.lerp(targetPos.current, lerp);
    camera.lookAt(LOOK_AT);
  });

  return null;
}

function SceneLighting() {
  return (
    <>
      {/* Key light — warm, cinematic */}
      <spotLight
        position={[4, 14, 8]}
        angle={0.35}
        penumbra={0.85}
        intensity={2.8}
        color="#fff8ee"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      {/* Rim light — soft warm edge */}
      <spotLight
        position={[-6, 6, -8]}
        angle={0.5}
        penumbra={1}
        intensity={0.9}
        color="#ffe8cc"
      />
      {/* Fill */}
      <directionalLight position={[-3, 4, 6]} intensity={0.15} color="#f5f0e8" />
      <ambientLight intensity={0.06} color="#e8e4dc" />
      {/* Sculpture accent */}
      <pointLight position={[0, 3, 4]} intensity={0.5} color="#fff5e0" distance={12} decay={2} />
    </>
  );
}

interface JWorldHubProps {
  businesses: BusinessWithTheme[];
  onEnterWorld: (route: string) => void;
  onHoverWorld?: (slug: string | null) => void;
  hoveredSlug?: string | null;
  focusSlug?: string | null;
  lowEnd?: boolean;
}

function Scene({
  businesses,
  onEnterWorld,
  onHoverWorld,
  hoveredSlug,
  focusSlug,
  lowEnd,
}: JWorldHubProps) {
  return (
    <>
      <color attach="background" args={["#080807"]} />
      <fog attach="fog" args={["#080807", 14, 32]} />

      <Environment preset="warehouse" background={false} environmentIntensity={0.25} />

      <SceneLighting />
      <CameraController hoveredSlug={hoveredSlug ?? null} focusSlug={focusSlug ?? null} />

      <HeadquartersArchitecture />
      <CentralJ />

      {businesses.map((biz) => {
        const layout = WORLD_LAYOUT[biz.slug];
        if (!layout) return null;
        return (
          <WorldEnvironment
            key={biz.id}
            position={layout.position}
            rotation={layout.rotation}
            photo={biz.heroImage || layout.photo}
            accent={layout.accent}
            onClick={() => onEnterWorld(biz.route)}
            onHover={(h) => onHoverWorld?.(h ? biz.slug : null)}
          />
        );
      })}

      <FutureWorldEnvironment position={FUTURE_WORLD.position} rotation={FUTURE_WORLD.rotation} />

      {!lowEnd && (
        <ContactShadows
          position={[0, -2.39, 0]}
          opacity={0.45}
          scale={22}
          blur={2}
          far={6}
          color="#000000"
        />
      )}

      <EffectComposer multisampling={lowEnd ? 0 : 4}>
        {!lowEnd && (
          <DepthOfField
            focusDistance={0.015}
            focalLength={0.05}
            bokehScale={1.5}
          />
        )}
        <Bloom
          intensity={0.12}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.95}
          mipmapBlur
        />
        <Vignette offset={0.35} darkness={0.55} />
      </EffectComposer>
    </>
  );
}

export function JWorldHub({
  businesses,
  onEnterWorld,
  onHoverWorld,
  hoveredSlug,
  focusSlug,
  lowEnd = false,
}: JWorldHubProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 1.4, 11.5], fov: 42 }}
        dpr={lowEnd ? [1, 1] : [1, 1.75]}
        shadows={!lowEnd}
        gl={{
          antialias: !lowEnd,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95,
        }}
      >
        <Suspense fallback={null}>
          <Scene
            businesses={businesses}
            onEnterWorld={onEnterWorld}
            onHoverWorld={onHoverWorld}
            hoveredSlug={hoveredSlug}
            focusSlug={focusSlug}
            lowEnd={lowEnd}
          />
        </Suspense>
      </Canvas>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(8,8,7,0.65) 100%)",
        }}
      />
    </div>
  );
}
