"use client";
import React, { useEffect } from "react";
import styles from "./LoadingOverlay.module.css";

export default function LoadingOverlay() {
  useEffect(() => {
    // Clerk will automatically inject the CAPTCHA into this div
    const captchaContainer = document.createElement("div");
    captchaContainer.id = "clerk-captcha-container";
    document.body.appendChild(captchaContainer);

    // Style the container to appear centered in the overlay
    Object.assign(captchaContainer.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 10002,
    });

    // Clean up on unmount
    return () => {
      if (document.body.contains(captchaContainer)) {
        document.body.removeChild(captchaContainer);
      }
    };
  }, []);

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Redirecting to Google...</p>
      </div>
    </div>
  );
}
