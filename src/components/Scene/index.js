"use client";
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { Environment } from "@react-three/drei";
import { useState } from "react";
import styles from "./index.module.css";

export default function Index() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.canvasWrapper}>
        <Canvas className={styles.canvas}>
          <Model hovered={hovered} setHovered={setHovered} />
          <directionalLight intensity={2} position={[0, 2, 3]} />
          <Environment preset="studio" />
        </Canvas>
      </div>

      <div className={`${styles.text} ${hovered ? styles.textVisible : ""}`}>
        Click to sign in
      </div>
    </div>
  );
}
