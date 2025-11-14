"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, Group } from "three";

function Globe() {
  const group = useRef<Group | null>(null);
  const wire = useRef<Mesh | null>(null);

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.2;
    if (wire.current) wire.current.rotation.y -= delta * 0.15;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#081826" metalness={0.3} roughness={0.6} />
      </mesh>

      <mesh ref={wire} scale={1.01}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#00f6ff" wireframe={true} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export default function Canvas3D() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <Globe />
    </Canvas>
  );
}
