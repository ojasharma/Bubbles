import React, { useRef, useMemo, useState, useEffect } from "react";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import * as THREE from "three";

export default function TorusElement({
  setHovered,
  hovered,
  clicked,
  isReturning,
  onClickBubble,
}) {
  const { nodes } = useGLTF("/medias/bubble3d.glb");
  const meshRef = useRef();

  // Track if auto-rotation is currently active
  const [isAutoRotating, setIsAutoRotating] = useState(true);



  // Keep track of last hover time and current rotation values
  const lastInteractionTime = useRef(0);
  const currentRotation = useRef({ x: 0, y: 0, z: 0 });
  const rotationSpeed = 0.002;

  // Main spring for torus animations
  const [springs, api] = useSpring(() => ({
    scale: 20,
    position: [0, 0, 0],
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    config: { tension: 120, friction: 14 },
    onChange: ({ value }) => {
      // Keep track of current rotation values
      currentRotation.current = {
        x: value.rotationX,
        y: value.rotationY,
        z: value.rotationZ,
      };
    },
  }));

  // Material properties
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

  // Handle hover state changes
  useEffect(() => {
    if (clicked || isReturning) return;

    const now = Date.now();
    lastInteractionTime.current = now;

    if (hovered) {
      // Pause auto-rotation when hovering
      setIsAutoRotating(false);

      // Animate to zero rotation when hovering
      api.start({
        scale: 22,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        config: { tension: 120, friction: 14 },
      });
    } else {
      // When unhovered, stay at current position momentarily
      // Auto-rotation will smoothly take over
      api.start({
        scale: 20,
        config: { tension: 120, friction: 14 },
        onRest: () => {
          // Resume auto-rotation after unhover animation completes
          setIsAutoRotating(true);
        },
      });
    }
  }, [hovered, clicked, isReturning, api]);

  // Handle click/return state changes
  useEffect(() => {
    const now = Date.now();
    lastInteractionTime.current = now;
    setIsAutoRotating(false);

    if (clicked) {
      // When clicked, animate to expanded state
      api.start({
        scale: 15,
        position: [0, 0, 0],
        rotationX: 0,
        rotationY: 0,
        rotationZ: -Math.PI / 2,
        config: { tension: 130, friction: 30, mass: 2 },
      });
    } else if (isReturning) {
      // When returning, reset to default state
      api.start({
        scale: 20,
        position: [0, 0, 0],
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        config: { tension: 60, friction: 30, mass: 1.5 },
        onRest: () => {
          // Resume auto-rotation after return animation
          setIsAutoRotating(true);
        },
      });
    }
  }, [clicked, isReturning, api]);

  // Frame update - handle auto-rotation when nothing else is happening
  useFrame((state, delta) => {
    // Only auto-rotate when explicitly allowed and not interacting
    if (isAutoRotating && !hovered && !clicked && !isReturning) {
      // Time since last interaction
      const timeSinceLastInteraction = Date.now() - lastInteractionTime.current;

      if (timeSinceLastInteraction > 500) {
        // Smoothly animate rotation with springs rather than directly setting values
        api.start({
          rotationX: currentRotation.current.x + rotationSpeed * 10,
          rotationY: currentRotation.current.y + rotationSpeed * 10,
          config: { duration: 200, easing: (t) => t },
          reset: false,
        });
      }
    }
    
  });
  useEffect(() => {
    // Set a small timeout to ensure everything else is initialized
    const timer = setTimeout(() => {
      setIsAutoRotating(true);
      lastInteractionTime.current = 0; // Reset interaction time to ensure rotation starts
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  

  return (
    <a.group scale={springs.scale} position={springs.position}>
      <a.mesh
        ref={meshRef}
        geometry={nodes.Curve.geometry}
        rotation-x={springs.rotationX}
        rotation-y={springs.rotationY}
        rotation-z={springs.rotationZ}
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
