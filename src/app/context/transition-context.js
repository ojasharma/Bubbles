// app/context/transition-context.js
"use client";

import { createContext, useState, useContext } from "react";

export const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <TransitionContext.Provider value={{ isTransitioning, setIsTransitioning }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor:"rgb(209, 131, 131)",
          zIndex: 0,
        }}
      >
        {/* Black background layer */}
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}
