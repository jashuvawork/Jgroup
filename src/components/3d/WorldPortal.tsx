"use client";

import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Text, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface WorldPortalProps {
  position: [number, number, number];
  name: string;
  emoji: string;
  color: string;
  secondaryColor: string;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function WorldPortal({
  position,
  name,
  emoji,
  color,
  secondaryColor,
  onClick,
  onHover,
}: WorldPortalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    const scale = hovered ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  });

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
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[1.2, 32, 32]} />
          <MeshDistortMaterial
            color={color}
            emissive={secondaryColor}
            emissiveIntensity={hovered ? 0.8 : 0.3}
            roughness={0.2}
            metalness={0.8}
            distort={hovered ? 0.4 : 0.2}
            speed={2}
            transparent
            opacity={0.85}
          />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[1.4, 1.5, 64]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.6 : 0.2} side={THREE.DoubleSide} />
        </mesh>

        <Text
          position={[0, -2, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          {name.toUpperCase()}
        </Text>

        <Text
          position={[0, 0, 1.3]}
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
        >
          {emoji}
        </Text>
      </group>
    </Float>
  );
}
