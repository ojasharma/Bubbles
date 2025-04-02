"use client";
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { Environment } from "@react-three/drei";
import { useState } from "react";
import styles from "./index.module.css";

export default function Index() {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Add the big blue circle as the first element */}
      <div className={styles.backgroundCircle}></div>

      <div style={{ width: "100%", height: "100%" }}>
        <Canvas style={{ width: "100%", height: "100%" }}>
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
