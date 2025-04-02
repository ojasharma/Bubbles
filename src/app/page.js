// src/app/page.js (or your Home component file)
"use client"; // Required for useState and useEffect

import React, { useState, useEffect, Suspense } from "react"; // Import hooks
import styles from "./page.module.css";
import dynamic from "next/dynamic";

// Import the loading component
import LoadingScreen from "@/components/LoadingScreen"; // Adjust path if needed

// --- Keep dynamic imports for code splitting, but we won't use the 'loading' prop here ---
// We need references to the components themselves later.
const Scene = dynamic(() => import("@/components/Scene/index"), {
  ssr: false,
  // We'll handle loading state manually below, so no 'loading' prop here
});

const MouseFollower = dynamic(() => import("@/components/MouseFollower"), {
  ssr: false,
});
// --- ---

export default function Home() {
  // State to track if the essential scene component is ready to be rendered
  const [isSceneReady, setIsSceneReady] = useState(false);

  // Effect to signal readiness.
  // This approach assumes 'Scene' component becoming available via dynamic import
  // is the signal we need. If Scene does internal loading (assets),
  // you might need a more complex state passed up from Scene itself.
  useEffect(() => {
    // Since 'Scene' is dynamically imported, its availability indicates loading is done *for the component code*.
    // We set the state shortly after the component mounts to allow the dynamic import to resolve.
    // A small delay can sometimes help ensure rendering order, though often not strictly needed.
    const timer = setTimeout(() => {
      setIsSceneReady(true);
    }, 100); // Small delay (optional, adjust or remove if unnecessary)

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Runs once after initial render

  return (
    <main className={styles.main}>
      {/* Render LoadingScreen only when Scene is NOT ready */}
      {!isSceneReady && <LoadingScreen />}

      {/* Render Scene container and Scene itself only when ready */}
      {/* Using Suspense here handles potential async operations *within* Scene if it uses them */}
      {isSceneReady && (
        <div className={styles.scene}>
          <Suspense fallback={null}>
            {" "}
            {/* Can have a minimal fallback or null */}
            <Scene />
          </Suspense>
        </div>
      )}

      {/* Render MouseFollower only when Scene is ready */}
      {isSceneReady && (
        <Suspense fallback={null}>
          <MouseFollower />
        </Suspense>
      )}
    </main>
  );
}
