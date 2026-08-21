"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

function IntroAtmosphere() {
  const particles = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (particles.current) {
      particles.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <>
      <color attach="background" args={["#010101"]} />
      <fog attach="fog" args={["#010101", 8, 20]} />
      <Environment preset="city" environmentIntensity={0.35} />
      <spotLight position={[3, 5, 4]} angle={0.4} penumbra={0.9} intensity={2.5} color="#fff5e0" />
      <pointLight position={[-4, 1, 2]} intensity={0.8} color="#8b5cf6" />
      <ambientLight intensity={0.05} />

      <group ref={particles}>
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
            <meshBasicMaterial
              color={i % 4 === 0 ? "#c9a227" : "#ffffff"}
              transparent
              opacity={0.3 + Math.random() * 0.4}
            />
          </mesh>
        ))}
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
          <IntroAtmosphere />
        </Suspense>
      </Canvas>
    </div>
  );
}
