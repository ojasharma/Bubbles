import React, { useRef, useMemo } from "react";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import * as THREE from "three";

export default function TorusElement({ setHovered, hovered, clicked, isReturning, onClickBubble }) {
  // --- Basic Setup ---
  const { nodes } = useGLTF("/medias/bubble3d.glb");
  const torus = useRef();
  const shouldRotate = useRef(true);
  let rotationX = 0;
  let rotationY = 0;

  // --- Springs for Animation ---
  const [torusSpring, torusApi] = useSpring(() => ({
    scale: 20,
    rotation: [0, 0, 0],
    position: [0, 0, 0],
    config: { tension: 120, friction: 14 },
  }));

  // --- Materials ---
  const materialProps = useMemo(
    () => ({
      thickness: 1.1,
      roughness: 0,
      transmission: 1,
      ior: 1.2,
      chromaticAberration: 0.02,
      backside: true,
    }),
    []
  );

  // --- Update animations based on state ---
  React.useEffect(() => {
    // Only apply hover effects when NOT clicked AND NOT currently returning from clicked state
    if (!clicked && !isReturning) {
      torusApi.start({
        scale: hovered ? 22 : 20,
        rotation: hovered ? [0, 0, 0] : torusSpring.rotation.get(),
        config: { tension: 120, friction: 14 },
      });
    }
  }, [hovered, clicked, isReturning, torusApi, torusSpring.rotation]);

  // --- Animation for click state ---
  React.useEffect(() => {
    shouldRotate.current = !clicked && !isReturning;
    
    const slowConfig = { tension: 130, friction: 30, mass: 2 };
    const returnConfig = { tension: 60, friction: 30, mass: 1.5 };

    if (clicked) {
      // GOING TO clicked state
      torusApi.start({
        scale: 15,
        position: [0, 0, 0],
        rotation: [0, 0, -Math.PI / 2],
        config: slowConfig,
      });
    } else if (isReturning) {
      // RETURNING FROM clicked state
      torusApi.start({
        scale: 20,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        config: returnConfig,
        onRest: () => {
          shouldRotate.current = true;
          if (torus.current) {
            torus.current.rotation.x = 0;
            torus.current.rotation.y = 0;
            torus.current.rotation.z = 0;
          }
        },
      });
    }
  }, [clicked, isReturning, torusApi]);

  // --- Frame Loop ---
  useFrame((state, delta) => {
    // Continuous Torus rotation ONLY when:
    // - not hovered
    // - not clicked
    // - shouldRotate flag is true
    if (!hovered && !clicked && torus.current && shouldRotate.current) {
      rotationX = (rotationX + 0.002) % (2 * Math.PI);
      rotationY = (rotationY + 0.002) % (2 * Math.PI);
      
      torus.current.rotation.x = rotationX;
      torus.current.rotation.y = rotationY;

      torusApi.set({
        rotation: [
          torus.current.rotation.x,
          torus.current.rotation.y,
          torus.current.rotation.z,
        ],
      });
    }
  });

  // --- Render ---
  return (
    <a.group scale={torusSpring.scale} position={torusSpring.position}>
      <a.mesh
        ref={torus}
        geometry={nodes.Curve.geometry}
        rotation={torusSpring.rotation}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!clicked && !isReturning) setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        onClick={onClickBubble}
      >
        <MeshTransmissionMaterial {...materialProps} />
      </a.mesh>
    </a.group>
  );
}