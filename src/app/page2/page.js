// app/page2/page.js
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "../context/transition-context";
import { useState, useEffect } from "react";

export default function Page2() {
  const router = useRouter();
  const { isTransitioning, setIsTransitioning } = useTransition();
  const [opacity, setOpacity] = useState(0); // Start invisible

  // Fade in when component mounts
  useEffect(() => {
    // Small delay to ensure state is updated after render
    const timer = setTimeout(() => {
      setOpacity(1);
      setIsTransitioning(false);
    }, 10);

    return () => clearTimeout(timer);
  }, [setIsTransitioning]);

  const goToPage1 = () => {
    // Start fade out
    setOpacity(0);
    setIsTransitioning(true);

    // Wait for fade out animation to complete before navigating
    setTimeout(() => {
      router.push("/page1");
    }, 500); // Match transition duration
  };

  return (
    <div
      style={{
        opacity: opacity,
        transition: "opacity 0.5s ease",
        padding: "20px",
        backgroundColor: "white",
        minHeight: "100vh",
      }}
    >
      <h1>Page 2</h1>
      <button
        onClick={goToPage1}
        style={{
          padding: "10px 15px",
          background: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Back to Page 1
      </button>
    </div>
  );
}
