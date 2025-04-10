import React, { useState, useEffect } from "react";
import { useSpring, a } from "@react-spring/three";
import TorusElement from "./bubble/TorusElement";
import BubbleTextElement from "./bubbleText/BubbleTextElement";
import ExtraTextElements from "./extraText/ExtraTextElements";
import ArrowElements from "./interaction/ArrowElements";
import CompanyIconElements from "./companyIcons/CompanyIconElements";

export default function Model({ setHovered, hovered }) {
  // --- State Management ---
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [clicked, setClicked] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  // --- Springs for Animation ---
  const [otherElementsSpring, otherElementsApi] = useSpring(() => ({
    opacity: 1,
    zPosition: 0,
    config: { tension: 80, friction: 20 },
  }));

  // --- Window Resize Handling ---
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // --- Click Handler ---
  const handleClick = () => {
    const isCurrentlyClicked = !clicked;
    setClicked(isCurrentlyClicked);

    const slowConfig = { tension: 130, friction: 30, mass: 2 };
    const returnConfig = { tension: 60, friction: 30, mass: 1.5 };

    if (isCurrentlyClicked) {
      // Going to clicked state
      // Hide other elements
      otherElementsApi.start({
        opacity: 0,
        zPosition: -1,
        config: slowConfig,
      });
    } else {
      // Returning from clicked state
      setIsReturning(true);

      // Show other elements
      otherElementsApi.start({
        opacity: 1,
        zPosition: 0,
        config: returnConfig,
        onRest: () => {
          setIsReturning(false);
        },
      });
    }
  };

  // --- Render ---
  return (
    <group>
      {/* Torus Bubble */}
      <TorusElement
        setHovered={setHovered}
        hovered={hovered}
        clicked={clicked}
        isReturning={isReturning}
        onClickBubble={handleClick}
      />

      {/* Company Icons */}
      <CompanyIconElements clicked={clicked} isReturning={isReturning} />

      {/* Wrapper Group for Other Elements (Text + Arrows) */}
      <a.group position-z={otherElementsSpring.zPosition}>
        {/* BUBBLES Text */}
        <BubbleTextElement opacity={otherElementsSpring.opacity} />

        {/* Welcome to Note TakeR Text */}
        <ExtraTextElements opacity={otherElementsSpring.opacity} />

        {/* Arrow Elements */}
        <ArrowElements opacity={otherElementsSpring.opacity} />
      </a.group>
    </group>
  );
}
