// src/app/page1/page.js
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Page1() {
  const [animationState, setAnimationState] = useState("idle");
  const router = useRouter();

  const handleClick = () => {
    if (animationState !== "idle") return;

    setAnimationState("growing");

    setTimeout(() => {
      router.push("/page2");
    }, 2000); // Total animation time
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <motion.button
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#4CAF50",
          border: "none",
          cursor: animationState === "idle" ? "pointer" : "default",
        }}
        onClick={handleClick}
        initial={false}
        animate={{
          scale: animationState === "growing" ? [1.1, 1.5] : 1,
        }}
        transition={{
          duration: 2,
          times: [0, 1], // Immediate jump to 1.1, then animate to 1.5
          ease: [0, 0.7, 0.2, 1], // Custom easing curve
        }}
      />
    </div>
  );
}
