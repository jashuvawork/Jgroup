"use client";

import { useRef, Suspense } from "react";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

const SCULPTURE_METAL = new THREE.Color("#1a1a18");
const EDGE_GOLD = new THREE.Color("#8a7340");

export function CentralJ() {
  const sculptureRef = useRef<THREE.Group>(null);

  return (
    <group ref={sculptureRef}>
      {/* Pedestal — dark stone */}
      <mesh position={[0, -2.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 1.1, 0.5, 32]} />
        <meshStandardMaterial color="#121210" roughness={0.75} metalness={0.15} />
      </mesh>
      <mesh position={[0, -1.78, 0]} castShadow>
        <cylinderGeometry args={[1.15, 1.15, 0.06, 32]} />
        <meshStandardMaterial color="#2a2826" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Physical J sculpture — dark brushed metal */}
      <Suspense
        fallback={
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.5, 2.5, 0.5]} />
            <meshStandardMaterial color="#1a1a18" metalness={0.9} roughness={0.4} />
          </mesh>
        }
      >
        <Center position={[0, 0.15, 0]}>
          <Text3D
            font="/fonts/gentilis_bold.typeface.json"
            size={2.4}
            height={0.28}
            bevelEnabled
            bevelThickness={0.035}
            bevelSize={0.018}
            bevelSegments={6}
            curveSegments={20}
            castShadow
            receiveShadow
          >
            J
            <meshStandardMaterial
              color={SCULPTURE_METAL}
              metalness={0.92}
              roughness={0.38}
              envMapIntensity={0.9}
              emissive={EDGE_GOLD}
              emissiveIntensity={0.06}
            />
          </Text3D>
        </Center>
      </Suspense>

      {/* Soft contact shadow under sculpture */}
      <mesh position={[0, -2.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
