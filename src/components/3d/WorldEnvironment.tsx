"use client";

import { useRef, useState, Suspense } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface WorldEnvironmentProps {
  position: [number, number, number];
  rotation: [number, number, number];
  photo: string;
  accent: string;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function EnvironmentFrame({
  photo,
  accent,
  hovered,
}: {
  photo: string;
  accent: string;
  hovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(photo);
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame(() => {
    if (groupRef.current) {
      const target = hovered ? 1.03 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.05);
    }
  });

  const frameW = 3.2;
  const frameH = 2.2;
  const frameD = 0.35;

  return (
    <group ref={groupRef}>
      {/* Stone niche backing */}
      <mesh position={[0, 0, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[frameW + 0.6, frameH + 0.6, frameD]} />
        <meshStandardMaterial color="#161614" roughness={0.82} metalness={0.08} />
      </mesh>

      {/* Brushed metal frame */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[frameW + 0.12, frameH + 0.12, 0.08]} />
        <meshStandardMaterial color="#2c2c2a" metalness={0.88} roughness={0.32} />
      </mesh>

      {/* Inner frame opening */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[frameW, frameH, 0.04]} />
        <meshStandardMaterial color="#0e0e0c" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Photographic environment */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[frameW - 0.15, frameH - 0.15]} />
        <meshStandardMaterial map={texture} roughness={0.7} metalness={0} />
      </mesh>

      {/* Warm accent light on frame */}
      <spotLight
        position={[0, 2.5, 2]}
        angle={0.45}
        penumbra={0.9}
        intensity={hovered ? 2.2 : 1.2}
        color="#fff5e6"
        distance={8}
        castShadow
        shadow-mapSize={[512, 512]}
      />

      {/* Floor platform extending from niche */}
      <mesh position={[0, -1.35, 0.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[frameW + 0.4, 2.2]} />
        <meshStandardMaterial color="#111110" roughness={0.7} metalness={0.12} />
      </mesh>

      {/* Subtle accent strip */}
      <mesh position={[0, -(frameH / 2) - 0.08, 0.12]}>
        <boxGeometry args={[frameW * 0.6, 0.02, 0.02]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={hovered ? 0.25 : 0.08}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

export function WorldEnvironment({
  position,
  rotation,
  photo,
  accent,
  onClick,
  onHover,
}: WorldEnvironmentProps) {
  const [hovered, setHovered] = useState(false);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group position={position} rotation={rotation}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[3, 2, 0.2]} />
              <meshStandardMaterial color="#1a1a18" />
            </mesh>
          }
        >
          <EnvironmentFrame photo={photo} accent={accent} hovered={hovered} />
        </Suspense>
      </group>
    </group>
  );
}

/** Distant fourth environment — mysterious, coming soon */
export function FutureWorldEnvironment({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.15]}>
        <boxGeometry args={[2.4, 1.8, 0.3]} />
        <meshStandardMaterial color="#0c0c0b" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[2.2, 1.6, 0.04]} />
        <meshStandardMaterial color="#080807" roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Subtle architectural slit light */}
      <mesh position={[0, 0.3, 0.06]}>
        <planeGeometry args={[0.8, 0.04]} />
        <meshStandardMaterial
          color="#fff8ee"
          emissive="#c9a227"
          emissiveIntensity={0.2}
        />
      </mesh>
      <pointLight position={[0, 0.5, 1]} intensity={0.4} color="#fff5e0" distance={4} />
    </group>
  );
}
