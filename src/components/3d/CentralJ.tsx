"use client";

import { useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center, MeshReflectorMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { ParticleField } from "./ParticleField";

const GOLD = new THREE.Color("#c9a227");
const GOLD_EMISSIVE = new THREE.Color("#8a6d12");

export function CentralJ() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.06;
      ring1Ref.current.rotation.y = t * 0.04;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.045;
      ring2Ref.current.rotation.z = t * 0.07;
    }
  });

  return (
    <group>
      {/* Cinematic lighting */}
      <spotLight
        position={[4, 8, 6]}
        angle={0.35}
        penumbra={0.8}
        intensity={3}
        color="#fff8e7"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight position={[-5, 3, 4]} angle={0.4} penumbra={1} intensity={1.2} color="#8b5cf6" />
      <pointLight position={[0, -2, 4]} intensity={0.6} color="#c9a227" distance={12} />
      <ambientLight intensity={0.15} />

      {/* Reflective platform */}
      <mesh position={[0, -2.35, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.5, 64]} />
        <MeshReflectorMaterial
          blur={[280, 100]}
          resolution={512}
          mixBlur={0.8}
          mixStrength={0.35}
          roughness={0.85}
          depthScale={0.6}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0a"
          metalness={0.6}
          mirror={0.4}
        />
      </mesh>

      {/* Orbital rings — thin brushed metal */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.2, 0.012, 8, 128]} />
        <meshStandardMaterial color="#c9a227" metalness={0.95} roughness={0.25} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[3.6, 0.008, 8, 128]} />
        <meshStandardMaterial color="#a78bfa" metalness={0.9} roughness={0.3} transparent opacity={0.35} />
      </mesh>

      {/* Extruded metallic J */}
      <Float speed={0.4} rotationIntensity={0} floatIntensity={0.04}>
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[0.5, 2.5, 0.5]} />
            <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.2} />
          </mesh>
        }>
          <Center position={[0, 0.2, 0]}>
            <Text3D
              font="/fonts/gentilis_bold.typeface.json"
              size={2.2}
              height={0.35}
              bevelEnabled
              bevelThickness={0.04}
              bevelSize={0.02}
              bevelSegments={8}
              curveSegments={16}
              castShadow
              receiveShadow
            >
              J
              <meshStandardMaterial
                color={GOLD}
                emissive={GOLD_EMISSIVE}
                emissiveIntensity={0.15}
                metalness={0.92}
                roughness={0.18}
                envMapIntensity={1.2}
              />
            </Text3D>
          </Center>
        </Suspense>
      </Float>

      {/* Ground glow */}
      <mesh position={[0, -2.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial color="#c9a227" transparent opacity={0.08} />
      </mesh>

      <ParticleField count={200} color="#8b5cf6" accentColor="#c9a227" size={0.008} speed={0.15} />
    </group>
  );
}
