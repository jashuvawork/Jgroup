"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Text, Float, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface WorldPortalProps {
  position: [number, number, number];
  name: string;
  color: string;
  secondaryColor: string;
  accentColor: string;
  heroImage?: string | null;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

const FALLBACK_TEXTURE =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=512&q=80";

function PortalCore({
  color,
  secondaryColor,
  accentColor,
  heroImage,
  hovered,
}: {
  color: string;
  secondaryColor: string;
  accentColor: string;
  heroImage?: string | null;
  hovered: boolean;
}) {
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  const texture = useTexture(heroImage || FALLBACK_TEXTURE);
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (innerRef.current) innerRef.current.rotation.y = t * 0.08;
    if (ringRef.current) ringRef.current.rotation.z = t * 0.25;
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.18;
    if (outerRef.current) {
      const s = hovered ? 1.08 : 1;
      outerRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.06);
    }
  });

  return (
    <group ref={outerRef}>
      {/* Glass outer shell */}
      <mesh>
        <sphereGeometry args={[1.15, 64, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.05}
          roughness={0.05}
          transmission={0.92}
          thickness={0.8}
          ior={1.45}
          transparent
          opacity={0.35}
          envMapIntensity={1}
        />
      </mesh>

      {/* Inner world — photo mapped on interior sphere */}
      <mesh ref={innerRef} scale={0.72}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          map={texture}
          side={THREE.BackSide}
          metalness={0.1}
          roughness={0.55}
          emissive={new THREE.Color(color)}
          emissiveIntensity={hovered ? 0.2 : 0.06}
        />
      </mesh>

      {/* Brushed metal orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.35, 0.018, 8, 96]} />
        <meshStandardMaterial
          color={secondaryColor}
          metalness={0.95}
          roughness={0.2}
          emissive={new THREE.Color(color)}
          emissiveIntensity={hovered ? 0.35 : 0.12}
        />
      </mesh>

      {/* Gold accent ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, Math.PI / 5]}>
        <torusGeometry args={[1.5, 0.01, 8, 96]} />
        <meshStandardMaterial
          color="#c9a227"
          metalness={0.9}
          roughness={0.25}
          transparent
          opacity={hovered ? 0.55 : 0.22}
        />
      </mesh>

      <pointLight color={accentColor} intensity={hovered ? 1.8 : 0.6} distance={4} decay={2} />

      {/* Pedestal */}
      <mesh position={[0, -1.35, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.25, 32]} />
        <meshStandardMaterial color="#0c0c0c" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.85, 48]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
          emissive={new THREE.Color(color)}
          emissiveIntensity={0.15}
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
}

export function WorldPortal({
  position,
  name,
  color,
  secondaryColor,
  accentColor,
  heroImage,
  onClick,
  onHover,
}: WorldPortalProps) {
  const [hovered, setHovered] = useState(false);

  const beamPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const t = i / 32;
      const ease = t * t * (3 - 2 * t);
      pts.push(new THREE.Vector3(
        position[0] * (1 - ease),
        position[1] * (1 - ease) - Math.sin(t * Math.PI) * 0.3,
        position[2] * (1 - ease)
      ));
    }
    return pts;
  }, [position]);

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
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.25}>
      <group position={position}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(beamPoints.flatMap((p) => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={hovered ? 0.18 : 0.04} />
        </line>

        <group
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <Suspense fallback={
            <mesh>
              <sphereGeometry args={[0.9, 32, 32]} />
              <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
            </mesh>
          }>
            <PortalCore
              color={color}
              secondaryColor={secondaryColor}
              accentColor={accentColor}
              heroImage={heroImage}
              hovered={hovered}
            />
          </Suspense>
        </group>

        <Text
          position={[0, -2.15, 0]}
          fontSize={0.15}
          color="#f5f0e8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.14}
          fillOpacity={hovered ? 0.9 : 0.5}
        >
          {name.toUpperCase()}
        </Text>
      </group>
    </Float>
  );
}
