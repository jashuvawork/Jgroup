"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

const STONE = "#141412";
const METAL = "#2a2a28";

export function HeadquartersArchitecture() {
  return (
    <group>
      {/* Dark marble floor */}
      <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={512}
          mixBlur={0.9}
          mixStrength={0.25}
          roughness={0.55}
          depthScale={0.8}
          minDepthThreshold={0.5}
          maxDepthThreshold={1.5}
          color="#0a0a09"
          metalness={0.15}
          mirror={0.35}
        />
      </mesh>

      {/* Gold J inlay ring on floor */}
      <mesh position={[0, -2.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.75, 64]} />
        <meshStandardMaterial color="#8a7340" metalness={0.85} roughness={0.35} />
      </mesh>

      {/* Pathway light strips toward each world */}
      {[
        [-3.5, -2.37, 0],
        [3.5, -2.37, 0],
        [0, -2.37, -3.5],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, 5]} />
          <meshStandardMaterial
            color="#fff8ee"
            emissive="#c9a227"
            emissiveIntensity={0.15}
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      ))}

      {/* Back wall */}
      <mesh position={[0, 2, -14]} receiveShadow>
        <boxGeometry args={[36, 10, 0.6]} />
        <meshStandardMaterial color={STONE} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-14, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[28, 10, 0.6]} />
        <meshStandardMaterial color={STONE} roughness={0.88} metalness={0.04} />
      </mesh>
      <mesh position={[14, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[28, 10, 0.6]} />
        <meshStandardMaterial color={STONE} roughness={0.88} metalness={0.04} />
      </mesh>

      {/* Architectural columns */}
      {[
        [-10, -0.5, -8],
        [10, -0.5, -8],
        [-10, -0.5, 6],
        [10, -0.5, 6],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.42, 5.8, 24]} />
          <meshStandardMaterial color={METAL} metalness={0.75} roughness={0.45} />
        </mesh>
      ))}

      {/* Ceiling beam accents */}
      <mesh position={[0, 5.5, -2]}>
        <boxGeometry args={[30, 0.15, 0.4]} />
        <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.35} />
      </mesh>
    </group>
  );
}
