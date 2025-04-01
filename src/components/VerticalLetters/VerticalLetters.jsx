"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./VerticalLetters.module.css";

export default function VerticalLetters({
  letters = ["B", "U", "B", "B", "L", "E", "S"],
  scrollSpeed = 0.5,
  width = 100, // Increased default width from 70 to 100
  fontSize = "4.3rem",
  direction = 1, // New prop: 1 for default, -1 for reverse
  responsive = true, // Add a flag to enable/disable responsive behavior
}) {
  const containerRefs = useRef(letters.map(() => React.createRef()));
  const contentRefs = useRef(letters.map(() => React.createRef()));
  const wrapperRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const animationFrameIds = useRef([]);
  const [columnWidth, setColumnWidth] = useState(width);
  const [fontSizeValue, setFontSizeValue] = useState(fontSize);
  const [letterHeight, setLetterHeight] = useState("3.8rem");
  const [letterMargin, setLetterMargin] = useState("0.4rem");

  const fontClasses = [
    styles.nml,
    styles.nml, // 1-2
    styles.nmli,
    styles.nmli, // 3-4
    styles.nmr,
    styles.nmr, // 5-6
    styles.nmri,
    styles.nmri, // 7-8
    styles.nmub,
    styles.nmub, // 9-10
    styles.nmubi,
    styles.nmubi, // 11-12
    styles.nmr,
    styles.nmr, // 13-14
    styles.nmri,
    styles.nmri, // 15-16
  ];

  // This function updates sizes based on viewport width
  const updateSizes = () => {
    if (!responsive || !wrapperRef.current) return;

    const viewportWidth = window.innerWidth;

    // Base size is calculated from a reference viewport width of 1440px
    const baseWidth = 1440;
    const scaleFactor = viewportWidth / baseWidth;

    // Get numeric value from fontSize (removing "rem")
    const baseFontSizeValue = parseFloat(fontSize.toString());

    // Using personalized values provided but with wider containers
    // Increase the minimum width to ensure letters don't get cut off
    const newWidth = Math.max(80, 1.19*  width * scaleFactor); // Increased width factor
    const newFontSize = Math.max(2.5, 2.4 * baseFontSizeValue * scaleFactor);
    const newLetterHeight = Math.max(2.2, 4.5 * scaleFactor);
    const newLetterMargin = Math.max(0.2, 2 * scaleFactor);

    // Update state values
    setColumnWidth(newWidth);
    setFontSizeValue(`${newFontSize}rem`);
    setLetterHeight(`${newLetterHeight}rem`);
    setLetterMargin(`${newLetterMargin}rem`);

    // Force scroll position update for all columns to prevent initial small letters
    setTimeout(() => {
      letters.forEach((_, letterIndex) => {
        const container = containerRefs.current[letterIndex]?.current;
        const content = contentRefs.current[letterIndex]?.current;
        if (container && content) {
          // Ensure content is properly sized before scrolling
          const contentHeight = content.offsetHeight;
          if (contentHeight > 0) {
            // Trigger a small scroll to ensure rendering
            container.scrollTop = 1;
          }
        }
      });
    }, 100);
  };

  useEffect(() => {
    setIsMounted(true);
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      .${styles.scrollContainer}::-webkit-scrollbar {
        display: none;
      }
      .${styles.scrollContainer} {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(styleElement);

    // Initial size calculation
    updateSizes();

    // Add resize listener
    if (responsive) {
      window.addEventListener("resize", updateSizes);
    }

    const virtualScrollPositions = new Array(letters.length).fill(0);
    const displayedScrollPositions = new Array(letters.length).fill(0);
    const cleanupFunctions = [];
    const autoScrollSpeeds = letters.map((_, index) => {
      const randomFactor = 0.8 + Math.random() * 0.4; // Random multiplier between 0.8x and 1.2x
      return (
        (index % 2 === 0 ? 1 : -1) * scrollSpeed * direction * randomFactor
      );
    });

    letters.forEach((letter, letterIndex) => {
      const container = containerRefs.current[letterIndex]?.current;
      const content = contentRefs.current[letterIndex]?.current;

      if (!container || !content) return;

      container.style.height = "100vh";
      container.style.overflowY = "hidden";
      container.style.userSelect = "none";
      // Ensure width is set correctly with extra width
      container.style.width = `${columnWidth}px`;

      // Clone content to ensure continuous scrolling
      const clone = content.cloneNode(true);
      container.appendChild(clone);

      const easeFactor = 0.1;

      const animateScroll = () => {
        if (!container || !content) return;

        const contentHeight = content.offsetHeight;
        virtualScrollPositions[letterIndex] += autoScrollSpeeds[letterIndex];
        displayedScrollPositions[letterIndex] +=
          (virtualScrollPositions[letterIndex] -
            displayedScrollPositions[letterIndex]) *
          easeFactor;

        let scrollDisplay =
          displayedScrollPositions[letterIndex] % contentHeight;
        if (scrollDisplay < 0) scrollDisplay += contentHeight;

        container.scrollTop = scrollDisplay;

        animationFrameIds.current[letterIndex] =
          requestAnimationFrame(animateScroll);
      };

      // Start animation with a slight delay to ensure proper initialization
      setTimeout(() => {
        animateScroll();
      }, 50);

      const handleWheel = (e) => {
        if (!e.shiftKey) {
          e.preventDefault();
          virtualScrollPositions[letterIndex] += e.deltaY * 0.5;
        }
      };

      container.addEventListener("wheel", handleWheel);
      cleanupFunctions.push(() => {
        if (animationFrameIds.current[letterIndex]) {
          cancelAnimationFrame(animationFrameIds.current[letterIndex]);
        }
        container?.removeEventListener("wheel", handleWheel);
        if (container?.children?.length > 1) {
          container.removeChild(container.lastChild);
        }
      });
    });

    return () => {
      animationFrameIds.current.forEach((id) => id && cancelAnimationFrame(id));
      animationFrameIds.current = [];
      cleanupFunctions.forEach((fn) => fn());
      document.head.removeChild(styleElement);
      if (responsive) {
        window.removeEventListener("resize", updateSizes);
      }
    };
  }, [letters, scrollSpeed, direction, responsive, columnWidth]);

  // Add resize effect to update container widths when columnWidth changes
  useEffect(() => {
    letters.forEach((_, letterIndex) => {
      const container = containerRefs.current[letterIndex]?.current;
      if (container) {
        container.style.width = `${columnWidth}px`;
      }
    });
  }, [columnWidth, letters]);

  return (
    <div className={styles.container} ref={wrapperRef}>
      <div className={styles.letterColumns}>
        {letters.map((letter, letterIndex) => (
          <div
            key={letterIndex}
            className={styles.scrollContainer}
            ref={containerRefs.current[letterIndex]}
            style={{
              width: `${columnWidth}px`, // Wider container width
              margin: "0 4px",
            }}
          >
            <div
              className={styles.content}
              ref={contentRefs.current[letterIndex]}
              style={{
                width: "100%", // Ensure content uses full container width
              }}
            >
              {Array.from({ length: 16 }).map((_, index) => (
                <div
                  key={index}
                  className={`${styles.letter} ${fontClasses[index]}`}
                  style={{
                    fontSize: fontSizeValue,
                    height: letterHeight,
                    margin: `${letterMargin} 0`,
                    width: "100%", // Ensure letters use full width of container
                  }}
                >
                  {index % 2 === 0
                    ? letter.toUpperCase()
                    : letter.toLowerCase()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
