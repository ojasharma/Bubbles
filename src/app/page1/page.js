// app/page1/page.js
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "../context/transition-context";
import { useState, useEffect } from "react";

export default function Page1() {
  const router = useRouter();
  const { setIsTransitioning } = useTransition();
  const [opacity, setOpacity] = useState(0); // Start invisible

  // Ensure page fades in on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const goToPage2 = () => {
    // Start fade out
    setOpacity(0);
    setIsTransitioning(true);

    // Wait for fade out animation to complete before navigating
    setTimeout(() => {
      router.push("/page2");
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
      <h1>Page 1</h1>
      <button
        onClick={goToPage2}
        style={{
          padding: "10px 15px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Go to Page 2
      </button>
    </div>
  );
}
