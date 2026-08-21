"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Text, Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

interface WorldPortalProps {
  position: [number, number, number];
  name: string;
  emoji: string;
  color: string;
  secondaryColor: string;
  shape?: "sphere" | "torus" | "octahedron";
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function PortalGeometry({ shape }: { shape: string }) {
  if (shape === "torus") {
    return <torusGeometry args={[1, 0.35, 16, 48]} />;
  }
  if (shape === "octahedron") {
    return <octahedronGeometry args={[1.1, 0]} />;
  }
  return <icosahedronGeometry args={[1.1, 1]} />;
}

export function WorldPortal({
  position,
  name,
  emoji,
  color,
  secondaryColor,
  shape = "sphere",
  onClick,
  onHover,
}: WorldPortalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const beamPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      points.push(new THREE.Vector3(
        position[0] * (1 - t),
        position[1] * (1 - t),
        position[2] * (1 - t)
      ));
    }
    return points;
  }, [position]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
      const scale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      ringRef.current.scale.setScalar(hovered ? 1.3 : 1.1);
    }
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
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
      <group position={position}>
        {/* Connection beam to center */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(beamPoints.flatMap((p) => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={hovered ? 0.25 : 0.06} />
        </line>

        {/* Outer glow ring */}
        <mesh ref={ringRef}>
          <ringGeometry args={[1.6, 1.65, 64]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.5 : 0.15} side={THREE.DoubleSide} />
        </mesh>

        {/* Main portal */}
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <PortalGeometry shape={shape} />
          <MeshDistortMaterial
            color={color}
            emissive={secondaryColor}
            emissiveIntensity={hovered ? 1.2 : 0.4}
            roughness={0.15}
            metalness={0.85}
            distort={hovered ? 0.35 : 0.15}
            speed={3}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Sparkles on hover */}
        {hovered && (
          <Sparkles count={30} scale={3} size={2} speed={0.4} color={secondaryColor} />
        )}

        {/* Label */}
        <Text
          position={[0, -2.2, 0]}
          fontSize={0.2}
          color="#f5f0e8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          fillOpacity={hovered ? 1 : 0.6}
        >
          {name.toUpperCase()}
        </Text>

        {/* Emoji badge */}
        <mesh position={[0, 0, 1.4]}>
          <circleGeometry args={[0.35, 32]} />
          <meshBasicMaterial color="#030303" transparent opacity={0.7} />
        </mesh>
        <Text
          position={[0, 0, 1.45]}
          fontSize={0.4}
          anchorX="center"
          anchorY="middle"
        >
          {emoji}
        </Text>
      </group>
    </Float>
  );
}
