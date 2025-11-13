"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      typeof window !== "undefined" &&
      (window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
    );
  } catch (e) {
    return false;
  }
}

function EarthMesh() {
  const ref = useRef<THREE.Mesh | null>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#0f62a8" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* subtle wire overlay for longitude/latitude feel */}
      <mesh scale={[1.002, 1.002, 1.002]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#00ffff" wireframe={true} transparent opacity={0.06} />
      </mesh>

      {/* atmosphere glow */}
      <mesh scale={[1.09, 1.09, 1.09]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function Globe() {
  if (!isWebGLAvailable()) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {/* Simple SVG fallback globe */}
        <svg
          width="220"
          height="220"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-90"
        >
          <circle cx="12" cy="12" r="10" fill="#0b0f19" />
          <path d="M2 12h20" stroke="#00ffff" strokeWidth="0.6" opacity="0.8" />
          <path d="M12 2a15 15 0 010 20" stroke="#8a2be2" strokeWidth="0.6" opacity="0.7" />
          <path d="M6 4c2 3 6 4 12 4" stroke="#6bffb8" strokeWidth="0.5" opacity="0.6" />
        </svg>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
        <pointLight position={[-10, -10, -10]} intensity={0.15} />

        <Suspense fallback={null}>
          <EarthMesh />
          <Stars radius={50} depth={20} count={200} factor={4} saturation={0} fade />
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={true} autoRotate autoRotateSpeed={0.4} />
      </Canvas>
    </div>
  );
}
