import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { a } from "@react-spring/three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";

export default function ExtraTextElements({ opacity }) {
  // --- Load Font ---
  const DL = useLoader(FontLoader, "/fonts/DL.json");

  // --- Materials ---
  const textMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x666666,
      transparent: true,
    });
  }, []);

  // --- Text Geometries ---
  const hubblesLetters = useMemo(() => {
    const word = "Note TakeR";
    const spacing = 0.43;
    return word.split("").map((char, i) => {
      const geometry = new TextGeometry(char, {
        font: DL,
        size: 0.3,
        height: 0.001,
        curveSegments: 12,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, textMaterial);
      mesh.position.x = (i - word.length / 2) * spacing;
      mesh.name = `note-letter-${char}-${i}`;
      return mesh;
    });
  }, [DL, textMaterial]);

  const welcomeLetters = useMemo(() => {
    const word = "WelcomE to";
    const spacing = 0.43;
    return word.split("").map((char, i) => {
      const geometry = new TextGeometry(char, {
        font: DL,
        size: 0.3,
        height: 0.001,
        curveSegments: 12,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, textMaterial);
      mesh.position.x = (i - word.length / 2) * spacing;
      mesh.name = `welcome-letter-${char}-${i}`;
      return mesh;
    });
  }, [DL, textMaterial]);

  // --- Render ---
  return (
    <group position={[1.5, 0, -5.1]}>
      {/* Note TakeR Letters */}
      <group position={[6.7, -4, 0]}>
        {hubblesLetters.map((mesh) => (
          <a.primitive
            object={mesh}
            key={mesh.uuid}
            material-opacity={opacity}
          />
        ))}
      </group>

      {/* WelcomE to Letters */}
      <group position={[-9.5, 4, 0]}>
        {welcomeLetters.map((mesh) => (
          <a.primitive
            object={mesh}
            key={mesh.uuid}
            material-opacity={opacity}
          />
        ))}
      </group>
    </group>
  );
}
