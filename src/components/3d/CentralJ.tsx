"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, MeshDistortMaterial, Torus } from "@react-three/drei";
import * as THREE from "three";
import { ParticleField } from "./ParticleField";

export function CentralJ() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.15;
      ringRef.current.rotation.z = t * 0.1;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2.5 + Math.sin(t * 1.5) * 0.8;
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = 1 + Math.cos(t * 2) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight ref={lightRef} position={[0, 3, 2]} color="#e8d48b" intensity={2.5} distance={20} />
      <pointLight ref={light2Ref} position={[-3, -1, 3]} color="#8b5cf6" intensity={1} distance={15} />
      <ambientLight intensity={0.08} />

      {/* Orbital ring */}
      <Torus ref={ringRef} args={[2.8, 0.015, 16, 100]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#c9a227" transparent opacity={0.25} />
      </Torus>

      {/* Second ring */}
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 4]}>
        <torusGeometry args={[3.2, 0.008, 16, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.15} />
      </mesh>

      {/* J letter structure */}
      <group position={[0, 0, 0]}>
        <mesh position={[-0.35, 0.1, 0]} castShadow>
          <boxGeometry args={[0.45, 3.2, 0.45]} />
          <MeshDistortMaterial
            color="#f5f0e8"
            emissive="#c9a227"
            emissiveIntensity={0.4}
            metalness={0.95}
            roughness={0.05}
            distort={0.08}
            speed={1.5}
          />
        </mesh>
        <mesh position={[0.35, -1.05, 0]} rotation={[0, 0, -0.28]} castShadow>
          <boxGeometry args={[1.3, 0.45, 0.45]} />
          <MeshDistortMaterial
            color="#f5f0e8"
            emissive="#c9a227"
            emissiveIntensity={0.4}
            metalness={0.95}
            roughness={0.05}
            distort={0.08}
            speed={1.5}
          />
        </mesh>
      </group>

      {/* Base glow platform */}
      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.06} />
      </mesh>

      <Text
        position={[0, 3.8, 0]}
        fontSize={0.22}
        color="#c9a227"
        anchorX="center"
        letterSpacing={0.15}
        fillOpacity={0.7}
      >
        ONE VISION. MANY POSSIBILITIES.
      </Text>

      <ParticleField count={400} color="#8b5cf6" accentColor="#c9a227" size={0.012} />
    </group>
  );
}
