"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

function IntroLetter() {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.2) * 0.06;
      group.current.position.y = Math.sin(t * 0.4) * 0.05;
    }
    if (light.current) {
      light.current.intensity = 2.5 + Math.sin(t * 0.8) * 0.5;
    }
    state.camera.position.z = 5.5 + Math.sin(t * 0.15) * 0.15;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#010101"]} />
      <fog attach="fog" args={["#010101", 8, 20]} />
      <Environment preset="city" environmentIntensity={0.35} />
      <spotLight ref={light} position={[3, 5, 4]} angle={0.4} penumbra={0.9} intensity={2.5} color="#fff5e0" />
      <pointLight position={[-4, 1, 2]} intensity={0.8} color="#8b5cf6" />
      <ambientLight intensity={0.05} />

      {/* Particles */}
      {Array.from({ length: 80 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6 - 2,
          ]}
        >
          <sphereGeometry args={[0.008 + Math.random() * 0.012, 4, 4]} />
          <meshBasicMaterial color={i % 4 === 0 ? "#c9a227" : "#ffffff"} transparent opacity={0.3 + Math.random() * 0.4} />
        </mesh>
      ))}

      <group ref={group}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={2.8}
            height={0.4}
            bevelEnabled
            bevelThickness={0.05}
            bevelSize={0.025}
            bevelSegments={6}
            curveSegments={12}
          >
            J
            <meshStandardMaterial
              color="#c9a227"
              emissive="#5a4510"
              emissiveIntensity={0.2}
              metalness={0.95}
              roughness={0.15}
              envMapIntensity={1.5}
            />
          </Text3D>
        </Center>
      </group>

      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    </>
  );
}

export function IntroJ3D() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
      >
        <Suspense fallback={null}>
          <IntroLetter />
        </Suspense>
      </Canvas>
    </div>
  );
}
