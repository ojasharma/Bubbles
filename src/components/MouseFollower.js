"use client";

import { useEffect, useState, useRef } from "react";

const MouseFollower = () => {
  const circleSize = 50; // half of 100
  const radius = circleSize / 2;

  const [bubbles, setBubbles] = useState([
    {
      id: 0,
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      isMoving: false,
      bounces: 0,
      spawned: false,
    },
  ]);

  const requestRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMoveTime = useRef(Date.now());
  const gravity = 0.05;
  const energyLoss = 0.7;
  const maxBounces = 4;
  const maxBubbles = 4;
  const popSpeedThreshold = 700;

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX + 3, y: e.clientY + 6 };
      lastMoveTime.current = Date.now();
      setBubbles((prev) => prev.map((b) => ({ ...b, isMoving: true })));
    };

    const spawnBubble = () => {
      setBubbles((prev) => {
        if (prev.length < maxBubbles) {
          const newBubble = {
            id: Date.now(),
            position: { x: 50, y: 50 },
            velocity: {
              x: Math.random() * 4 - 2,
              y: Math.random() * 4 - 2,
            },
            isMoving: false,
            bounces: 0,
            spawned: false,
          };
          return [...prev, newBubble];
        }
        return prev;
      });
    };

    const updatePosition = () => {
      const currentTime = Date.now();
      const timeSinceLastMove = currentTime - lastMoveTime.current;

      setBubbles((prevBubbles) =>
        prevBubbles.flatMap((bubble, index) => {
          const { position, velocity, isMoving, bounces, spawned } = bubble;
          const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

          const angleOffset = (index / maxBubbles) * Math.PI * 2;
          const offsetX = Math.cos(angleOffset) * 180; // half of 80
          const offsetY = Math.sin(angleOffset) * 180;

          const dx = mousePos.current.x + offsetX - position.x;
          const dy = mousePos.current.y + offsetY - position.y;
          const distance = Math.sqrt(dx ** 2 + dy ** 2);

          let repellingForce = { x: 0, y: 0 };
          if (distance < 40) {
            const repellingStrength = (40 - distance) * 0.05;
            repellingForce = {
              x: (-dx / distance) * repellingStrength,
              y: (-dy / distance) * repellingStrength,
            };
          }

          const newVelocity = isMoving
            ? {
                x: dx * 0.1 + repellingForce.x,
                y: dy * 0.1 + repellingForce.y,
              }
            : {
                x: velocity.x * 0.95,
                y: velocity.y * 0.95 + gravity,
              };

          let newX = position.x + newVelocity.x;
          let newY = position.y + newVelocity.y;
          let newVelY = newVelocity.y;

          const windowHeight = window.innerHeight;
          const windowWidth = window.innerWidth;

          if (newY + radius >= windowHeight) {
            if (speed > popSpeedThreshold && isMoving) {
              spawnBubble();
              return [];
            }
            newY = windowHeight - radius;
            newVelY = -newVelocity.y * energyLoss;

            if (Math.abs(newVelY) < 1) newVelY = 0;
            if (bounces < maxBounces && !spawned) {
              spawnBubble();
              bubble.spawned = true;
            }
          }

          return {
            ...bubble,
            position: {
              x: Math.min(windowWidth - radius, Math.max(radius, newX)),
              y: newY,
            },
            velocity: { x: newVelocity.x, y: newVelY },
            isMoving: timeSinceLastMove <= 200,
          };
        })
      );

      requestRef.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      {bubbles.map((bubble) => {
        const speed = Math.sqrt(
          bubble.velocity.x ** 2 + bubble.velocity.y ** 2
        );
        const maxStretch = 4.5;
        const stretchFactor = Math.min(speed / 30, maxStretch);
        const angle = Math.atan2(bubble.velocity.y, bubble.velocity.x);

        return (
          <div
            key={bubble.id}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              pointerEvents: "none",
              transform: `translate(${bubble.position.x - radius}px, ${
                bubble.position.y - radius
              }px) rotate(${angle}rad) scale(${1 + stretchFactor}, ${
                1 - stretchFactor * 0.5
              })`,
              willChange: "transform",
              zIndex: 9999,
            }}
          >
            <img
              src="/bubble.png"
              alt="Bubble"
              style={{
                width: "100%",
                height: "100%",
                transform: `rotate(${-angle}rad)`,
                transformOrigin: "center",
              }}
            />
          </div>
        );
      })}
    </>
  );
};

export default MouseFollower;
