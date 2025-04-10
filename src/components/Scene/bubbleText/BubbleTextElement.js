import React, { useMemo, useState, useRef, useEffect } from "react";
import { useLoader, useThree, useFrame } from "@react-three/fiber";
import { useSprings, a } from "@react-spring/three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";

export default function BubbleTextElement({ opacity, disableHover }) {
  // --- Load Font ---
  const LG = useLoader(FontLoader, "/fonts/LG-R.json");
  const { camera } = useThree();

  // --- Refs and State ---
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const lastHoverTimes = useRef(Array(7).fill(null));

  // --- Materials ---
  const textMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x666666,
      transparent: true,
    });
  }, []);

  // --- Text Geometries ---
  const letters = useMemo(() => {
    const word = "BUBBLES";
    const spacing = 3;
    return word.split("").map((char, i) => {
      const geometry = new TextGeometry(char, {
        font: LG,
        size: 6.5,
        height: 0.001,
        curveSegments: 12,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, textMaterial);
      mesh.position.x = (i - word.length / 2) * spacing;
      mesh.name = `bubble-letter-${char}-${i}`;
      return mesh;
    });
  }, [LG, textMaterial]);

  // --- Springs for Animation ---
  const [letterSprings, letterApi] = useSprings(7, () => ({
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 120, friction: 20, precision: 0.001 },
  }));

  // --- Raycasting Setup ---
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useRef(new THREE.Vector2(-1000, -1000)); // Initialize to far off-screen

  // --- Mouse Move Event ---
  useEffect(() => {
    const onMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // --- Frame Loop ---
  useFrame(() => {
    // Always update raycaster (for smooth transitions)
    raycaster.setFromCamera(mouse.current, camera);
    const intersects = raycaster.intersectObjects(letters);
    const newHovered = intersects.length > 0 ? intersects[0].object : null;

    // Only process new hovers if not disabled
    if (!disableHover) {
      if (hoveredLetter !== newHovered) {
        setHoveredLetter(newHovered);
      }

      // Apply hover animations
      letters.forEach((letter, i) => {
        if (letter === newHovered) {
          const vector = letter.position.clone().project(camera);
          const deltaX = THREE.MathUtils.clamp(
            mouse.current.x - vector.x,
            -0.1,
            0.1
          );
          const deltaY = THREE.MathUtils.clamp(
            mouse.current.y - vector.y,
            -0.1,
            0.1
          );
          const targetRotX = -deltaY * 5;
          const targetRotY = deltaX * 15;
          lastHoverTimes.current[i] = Date.now();

          letterApi.start((index) =>
            index === i ? { rotation: [targetRotX, targetRotY, 0] } : undefined
          );
        }
      });
    }

    // Always process timeouts (even when disabled)
    const now = Date.now();
    lastHoverTimes.current.forEach((time, i) => {
      if (time && now - time > 500) {
        letterApi.start((index) =>
          index === i ? { rotation: [0, 0, 0] } : undefined
        );
        lastHoverTimes.current[i] = null;
      }
    });
  });

  // --- Render ---
  return (
    <group position={[1.5, 0, -5.1]}>
      {letters.map((mesh, i) => (
        <a.primitive
          object={mesh}
          key={mesh.uuid}
          rotation={letterSprings[i].rotation}
          material-opacity={opacity}
        />
      ))}
    </group>
  );
}
