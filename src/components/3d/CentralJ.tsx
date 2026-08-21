"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { ParticleField } from "./ParticleField";

export function CentralJ() {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight ref={lightRef} position={[0, 2, 0]} color="#ffffff" intensity={2} distance={15} />
      <ambientLight intensity={0.1} />

      {/* J letter structure */}
      <group position={[0, 0, 0]}>
        {/* Vertical stroke */}
        <mesh position={[-0.3, 0, 0]}>
          <boxGeometry args={[0.4, 3, 0.4]} />
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#a78bfa"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
            distort={0.1}
            speed={1}
          />
        </mesh>
        {/* Hook */}
        <mesh position={[0.3, -1.1, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[1.2, 0.4, 0.4]} />
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#a78bfa"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
            distort={0.1}
            speed={1}
          />
        </mesh>
      </group>

      <Text
        position={[0, 3.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        letterSpacing={0.2}
        fillOpacity={0.6}
      >
        ONE VISION. MANY POSSIBILITIES.
      </Text>

      <ParticleField count={300} color="#a78bfa" size={0.015} />
    </group>
  );
}
