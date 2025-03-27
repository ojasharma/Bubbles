"use client";
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { Environment } from "@react-three/drei";
import { useState } from "react";
import styles from "./index.module.css"; // Import the CSS module

export default function Index() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={styles.container}>
      <Canvas className={styles.canvas}>
        <Model hovered={hovered} setHovered={setHovered} />
        <directionalLight intensity={2} position={[0, 2, 3]} />
        <Environment preset="studio" />
      </Canvas>

      {/* Text below 3D, visible only on hover with fade-in animation */}
      <div className={`${styles.text} ${hovered ? styles.textVisible : ""}`}>
        Click to sign in
      </div>
    </div>
  );
}
