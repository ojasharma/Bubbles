import React, { useRef, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { a } from "@react-spring/three";
import * as THREE from "three";

export default function ArrowElements({ opacity }) {
  // --- Refs ---
  const arrowRef1 = useRef();
  const arrowRef2 = useRef();

  // --- Load Assets ---
  const arrowSvg = useLoader(THREE.TextureLoader, "/arrow.svg");

  // --- Materials ---
  const arrowMaterial1 = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: arrowSvg,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [arrowSvg]
  );

  const arrowMaterial2 = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: arrowSvg,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [arrowSvg]
  );

  // --- Event Handlers ---
  const handleArrowClick1 = (e) => {
    e.stopPropagation();
    window.open("https://github.com/ojasharma", "_blank");
  };

  const handleArrowClick2 = (e) => {
    e.stopPropagation();
    window.open("https://x.com/DieselSharma", "_blank");
  };

  // --- Render ---
  return (
    <group>
      {/* --- Arrow 1 (Top Right) --- */}
      <a.mesh
        position={[4.9, 2, 0]}
        rotation={[Math.PI, Math.PI, 0]}
        scale={[0.2, 0.2, 0.2]}
        material-opacity={opacity}
        onClick={handleArrowClick2}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          e.object.scale.set(0.22, 0.22, 0.22);
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = "auto";
          e.object.scale.set(0.2, 0.2, 0.2);
        }}
        ref={arrowRef2}
      >
        <planeGeometry args={[1, 1]} />
        <primitive object={arrowMaterial2} attach="material" />
      </a.mesh>

      {/* --- Arrow 2 (Bottom Left) --- */}
      <a.mesh
        position={[-5, -2, 0]}
        rotation={[0, 0, 0]}
        scale={[0.2, 0.2, 0.2]}
        material-opacity={opacity}
        onClick={handleArrowClick1}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          e.object.scale.set(0.22, 0.22, 0.22);
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = "auto";
          e.object.scale.set(0.2, 0.2, 0.2);
        }}
        ref={arrowRef1}
      >
        <planeGeometry args={[1, 1]} />
        <primitive object={arrowMaterial1} attach="material" />
      </a.mesh>
    </group>
  );
}
