"use client";
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { Environment } from "@react-three/drei";
import { useState } from "react";
import styles from "./index.module.css";
import { ClerkProvider } from "@clerk/nextjs";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";

export default function Index() {
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ClerkProvider>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {isLoading && <LoadingOverlay />}
        <Canvas style={{ width: "100vw", height: "100vh" }}>
          <Model
            hovered={hovered}
            setHovered={setHovered}
            setIsLoading={setIsLoading}
          />
          <directionalLight intensity={2} position={[0, 2, 3]} />
          <Environment preset="studio" />
        </Canvas>

        <div className={`${styles.text} ${hovered ? styles.textVisible : ""}`}>
          Click to sign in
        </div>
      </div>
    </ClerkProvider>
  );
}
