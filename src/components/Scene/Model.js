import React, { useRef, useMemo, useEffect, useState } from "react";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";
import { useSpring, a, useSprings } from "@react-spring/three";

export default function Model({ setHovered, hovered }) {
  // --- Basic Setup ---
  const { nodes } = useGLTF("/medias/bubble3d.glb");
  const torus = useRef();
  const { camera } = useThree();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [clicked, setClicked] = useState(false);

  // --- Load Assets ---
  const arrowSvg = useLoader(THREE.TextureLoader, "/arrow.svg");
  const googleSvg = useLoader(THREE.TextureLoader, "/google.svg");
  const appleSvg = useLoader(THREE.TextureLoader, "/apple.svg");
  const microsoftSvg = useLoader(THREE.TextureLoader, "/microsoft.svg");
  const facebookSvg = useLoader(THREE.TextureLoader, "/facebook.svg");
  const LG = useLoader(FontLoader, "/fonts/LG-R.json");
  const DL = useLoader(FontLoader, "/fonts/DL.json");

  // --- Refs for Elements ---
  const arrowRef1 = useRef();
  const arrowRef2 = useRef();
  const letterRefs = useRef([]);

  // --- Springs for Animation ---
  const [isReturning, setIsReturning] = useState(false);
  // Add this to track when rotation should be paused
  const shouldRotate = useRef(true);

  const [torusSpring, torusApi] = useSpring(() => ({
    scale: 20,
    rotation: [0, 0, 0],
    position: [0, 0, 0],
    config: { tension: 120, friction: 14 },
  }));

  const [otherElementsSpring, otherElementsApi] = useSpring(() => ({
    opacity: 1,
    zPosition: 0,
    config: { tension: 80, friction: 20 },
  }));

  const [letterSprings, letterApi] = useSprings(7, () => ({
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 120, friction: 20, precision: 0.001 },
  }));

  // Google logo spring
  const [googleSpring, googleApi] = useSpring(() => ({
    position: [0, 0, 0],
    opacity: 0, // Start with 0 opacity
    config: { tension: 120, friction: 14 },
  }));

  // Apple logo spring
  const [appleSpring, appleApi] = useSpring(() => ({
    position: [0, 0, 0],
    opacity: 0,
    config: { tension: 120, friction: 14 },
  }));

  // Microsoft logo spring
  const [microsoftSpring, microsoftApi] = useSpring(() => ({
    position: [0, 0, 0],
    opacity: 0,
    config: { tension: 120, friction: 14 },
  }));

  // Facebook logo spring
  const [facebookSpring, facebookApi] = useSpring(() => ({
    position: [0, 0, 0],
    opacity: 0,
    config: { tension: 120, friction: 14 },
  }));

  // --- Event Handlers ---
  const handleArrowClick1 = (e) => {
    e.stopPropagation();
    window.open("https://github.com/ojasharma", "_blank");
  };

  const handleArrowClick2 = (e) => {
    e.stopPropagation();
    window.open("https://x.com/DieselSharma", "_blank");
  };

const handleClick = () => {
  const isCurrentlyClicked = !clicked;
  setClicked(isCurrentlyClicked);
  shouldRotate.current = false;

  const slowConfig = { tension: 130, friction: 30, mass: 2 };
  const returnConfig = { tension: 60, friction: 30, mass: 1.5 };

  if (isCurrentlyClicked) {
    // GOING TO clicked state
    // Animate torus
    torusApi.start({
      scale: 15,
      position: [0, 0, 0],
      rotation: [0, 0, -Math.PI / 2],
      config: slowConfig,
    });

    // Hide other elements
    otherElementsApi.start({
      opacity: 0,
      zPosition: -1,
      config: slowConfig,
    });

    // Show and position logos
    googleApi.start({
      position: [0, 2.3, 0],
      opacity: 1,
      config: slowConfig,
    });
    appleApi.start({
      position: [0, -2.3, 0],
      opacity: 1,
      config: slowConfig,
    });
    microsoftApi.start({
      position: [2.3, 0, 0],
      opacity: 1,
      config: slowConfig,
    });
    facebookApi.start({
      position: [-2.3, 0, 0],
      opacity: 1,
      config: slowConfig,
    });
  } else {
    // RETURNING FROM clicked state
    setIsReturning(true);

    // Animate torus back
    torusApi.start({
      scale: 20,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      config: returnConfig,
      onRest: () => {
        setIsReturning(false);
        shouldRotate.current = true;
        if (torus.current) {
          torus.current.rotation.x = 0;
          torus.current.rotation.y = 0;
          torus.current.rotation.z = 0;
        }
      },
    });

    // Show other elements
    otherElementsApi.start({
      opacity: 1,
      zPosition: 0,
      config: returnConfig,
    });

    // Hide and reset logo positions
    googleApi.start({
      position: [0, 0, 0],
      opacity: 0,
      config: returnConfig,
    });
    appleApi.start({
      position: [0, 0, 0],
      opacity: 0,
      config: returnConfig,
    });
    microsoftApi.start({
      position: [0, 0, 0],
      opacity: 0,
      config: returnConfig,
    });
    facebookApi.start({
      position: [0, 0, 0],
      opacity: 0,
      config: returnConfig,
    });
  }
};

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Only apply hover effects when NOT clicked AND NOT currently returning from clicked state
    if (!clicked && !isReturning) {
      torusApi.start({
        scale: hovered ? 22 : 20,
        rotation: hovered ? [0, 0, 0] : torusSpring.rotation.get(),
        config: { tension: 120, friction: 14 },
      });
    }
  }, [hovered, clicked, isReturning, torusApi, torusSpring.rotation]);

  useEffect(() => {
    const onMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // --- Materials ---
  const textMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x666666,
      transparent: true,
    });
  }, []);

  const arrowMaterial1 = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: arrowSvg,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [arrowSvg]
  );

  const arrowMaterial2 = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: arrowSvg,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [arrowSvg]
  );

  const googleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: googleSvg,
        transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(1, 1, 1), // Brighten the colors
        toneMapped: false, // Disable tone mapping for more vibrant colors
      }),
    [googleSvg]
  );

  const appleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: appleSvg,
        transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(1, 1, 1), // Brighten the colors
        toneMapped: false, // Disable tone mapping for more vibrant colors
      }),
    [appleSvg]
  );

  const microsoftMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: microsoftSvg,
        transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(1, 1, 1), // Brighten the colors
        toneMapped: false, // Disable tone mapping for more vibrant colors
      }),
    [microsoftSvg]
  );

  const facebookMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: facebookSvg,
        transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(1, 1, 1), // Brighten the colors
        toneMapped: false, // Disable tone mapping for more vibrant colors
      }),
    [facebookSvg]
  );

  const materialProps = useMemo(
    () => ({
      thickness: 1.1,
      roughness: 0,
      transmission: 1,
      ior: 1.2,
      chromaticAberration: 0.02,
      backside: true,
    }),
    []
  );

  // --- Text Geometries ---
  const letters = useMemo(() => {
    const word = "BUBBLES";
    const spacing = 3;
    return word.split("").map((char, i) => {
      const geometry = new TextGeometry(char, {
        font: LG,
        size: 6.5,
        height: 0.001,
        curveSegments: 12,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, textMaterial);
      mesh.position.x = (i - word.length / 2) * spacing;
      mesh.name = `bubble-letter-${char}-${i}`;
      return mesh;
    });
  }, [LG, textMaterial]);

  const hubblesLetters = useMemo(() => {
    const word = "Note TakeR";
    const spacing = 0.43;
    return word.split("").map((char, i) => {
      const geometry = new TextGeometry(char, {
        font: DL,
        size: 0.3,
        height: 0.001,
        curveSegments: 12,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, textMaterial);
      mesh.position.x = (i - word.length / 2) * spacing;
      mesh.name = `note-letter-${char}-${i}`;
      return mesh;
    });
  }, [DL, textMaterial]);

  const welcomeLetters = useMemo(() => {
    const word = "WelcomE to";
    const spacing = 0.43;
    return word.split("").map((char, i) => {
      const geometry = new TextGeometry(char, {
        font: DL,
        size: 0.3,
        height: 0.001,
        curveSegments: 12,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, textMaterial);
      mesh.position.x = (i - word.length / 2) * spacing;
      mesh.name = `welcome-letter-${char}-${i}`;
      return mesh;
    });
  }, [DL, textMaterial]);

  useEffect(() => {
    letterRefs.current = [...letters, ...hubblesLetters, ...welcomeLetters];
  }, [letters, hubblesLetters, welcomeLetters]);

  // --- Raycasting Setup ---
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useRef(new THREE.Vector2());
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const lastHoverTimes = useRef(Array(letters.length).fill(null));

  // --- Frame Loop ---
  useFrame((state, delta) => {
    // 1. Continuous Torus rotation ONLY when:
    // - not hovered
    // - not clicked
    // - shouldRotate flag is true
    if (!hovered && !clicked && torus.current && shouldRotate.current) {
        rotationX = (rotationX + 0.002) % 2* Math.PI;
        rotationY = (rotationY + 0.002) % 2* Math.PI;

      torusApi.set({
        rotation: [
          torus.current.rotation.x,
          torus.current.rotation.y,
          torus.current.rotation.z,
        ],
      });
    }

    // 2. Raycasting for Letter Hover Interaction (only BUBBLES letters)
    raycaster.setFromCamera(mouse.current, camera);
    const intersects = raycaster.intersectObjects(letters);
    let newHovered = intersects.length > 0 ? intersects[0].object : null;

    if (hoveredLetter !== newHovered) {
      setHoveredLetter(newHovered);
    }

    // 3. Animate 'BUBBLES' letters based on hover
    letters.forEach((letter, i) => {
      if (letter === newHovered) {
        const vector = letter.position.clone().project(camera);
        const deltaX = THREE.MathUtils.clamp(
          mouse.current.x - vector.x,
          -0.1,
          0.1
        );
        const deltaY = THREE.MathUtils.clamp(
          mouse.current.y - vector.y,
          -0.1,
          0.1
        );
        const targetRotX = -deltaY * 5;
        const targetRotY = deltaX * 15;
        lastHoverTimes.current[i] = Date.now();

        letterApi.start((index) =>
          index === i ? { rotation: [targetRotX, targetRotY, 0] } : undefined
        );
      }
    });

    // 4. Reset letter rotation after hover timeout
    const now = Date.now();
    lastHoverTimes.current.forEach((time, i) => {
      if (time && now - time > 500) {
        letterApi.start((index) =>
          index === i ? { rotation: [0, 0, 0] } : undefined
        );
        lastHoverTimes.current[i] = null;
      }
    });
  });

  // --- Constants for Rendering ---
  const otherElementsScale = 1;

  // --- Render ---
  return (
    <group>
      {/* === Torus Model === */}
      <a.group scale={torusSpring.scale} position={torusSpring.position}>
        <a.mesh
          ref={torus}
          geometry={nodes.Curve.geometry}
          rotation={torusSpring.rotation}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (!clicked && !isReturning) setHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
          }}
          onClick={handleClick}
        >
          <MeshTransmissionMaterial {...materialProps} />
        </a.mesh>
      </a.group>

      {/* Google Logo */}
      <a.mesh
        position={googleSpring.position}
        scale={[0.6, 0.6, 0.6]}
      >
        <planeGeometry args={[1, 1]} />
        <a.primitive
          object={googleMaterial}
          attach="material"
          opacity={googleSpring.opacity}
        />
      </a.mesh>

      {/* Apple Logo */}
      <a.mesh position={appleSpring.position} scale={[0.6, 0.6, 0.6]}>
        <planeGeometry args={[1, 1]} />
        <a.primitive
          object={appleMaterial}
          attach="material"
          opacity={appleSpring.opacity}
        />
      </a.mesh>

      {/* Microsoft Logo */}
      <a.mesh position={microsoftSpring.position} scale={[0.6, 0.6, 0.6]}>
        <planeGeometry args={[1, 1]} />
        <a.primitive
          object={microsoftMaterial}
          attach="material"
          opacity={microsoftSpring.opacity}
        />
      </a.mesh>

      {/* Facebook Logo */}
      <a.mesh position={facebookSpring.position} scale={[0.6, 0.6, 0.6]}>
        <planeGeometry args={[1, 1]} />
        <a.primitive
          object={facebookMaterial}
          attach="material"
          opacity={facebookSpring.opacity}
        />
      </a.mesh>

      {/* === Wrapper Group for Other Elements (Text + Arrows) === */}
      <a.group
        scale={otherElementsScale}
        position-z={otherElementsSpring.zPosition}
      >
        {/* --- Text Elements --- */}
        <group position={[1.5 / otherElementsScale, 0, -5.1]}>
          {/* BUBBLES Letters - Apply individual hover rotation & group opacity */}
          {letters.map((mesh, i) => (
            <a.primitive
              object={mesh}
              key={mesh.uuid}
              rotation={letterSprings[i].rotation}
              material-opacity={otherElementsSpring.opacity}
            />
          ))}

          {/* Note TakeR Letters - Apply group opacity */}
          <group
            position={[6.7 / otherElementsScale, -4 / otherElementsScale, 0]}
          >
            {hubblesLetters.map((mesh) => (
              <a.primitive
                object={mesh}
                key={mesh.uuid}
                material-opacity={otherElementsSpring.opacity}
              />
            ))}
          </group>

          {/* WelcomE to Letters - Apply group opacity */}
          <group
            position={[-9.5 / otherElementsScale, 4 / otherElementsScale, 0]}
          >
            {welcomeLetters.map((mesh) => (
              <a.primitive
                object={mesh}
                key={mesh.uuid}
                material-opacity={otherElementsSpring.opacity}
              />
            ))}
          </group>
        </group>

        {/* --- Arrow 1 (Top Right) - Apply group opacity --- */}
        <a.mesh
          position={[4.9 / otherElementsScale, 2 / otherElementsScale, 0]}
          rotation={[Math.PI, Math.PI, 0]}
          scale={[
            0.2 / otherElementsScale,
            0.2 / otherElementsScale,
            0.2 / otherElementsScale,
          ]}
          material-opacity={otherElementsSpring.opacity}
          onClick={handleArrowClick2}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            e.object.scale.set(
              0.22 / otherElementsScale,
              0.22 / otherElementsScale,
              0.22 / otherElementsScale
            );
          }}
          onPointerOut={(e) => {
            document.body.style.cursor = "auto";
            e.object.scale.set(
              0.2 / otherElementsScale,
              0.2 / otherElementsScale,
              0.2 / otherElementsScale
            );
          }}
          ref={arrowRef2}
        >
          <planeGeometry args={[1, 1]} />
          <primitive object={arrowMaterial2} attach="material" />
        </a.mesh>

        {/* --- Arrow 2 (Bottom Left) - Apply group opacity --- */}
        <a.mesh
          position={[-5 / otherElementsScale, -2 / otherElementsScale, 0]}
          rotation={[0, 0, 0]}
          scale={[
            0.2 / otherElementsScale,
            0.2 / otherElementsScale,
            0.2 / otherElementsScale,
          ]}
          material-opacity={otherElementsSpring.opacity}
          onClick={handleArrowClick1}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            e.object.scale.set(
              0.22 / otherElementsScale,
              0.22 / otherElementsScale,
              0.22 / otherElementsScale
            );
          }}
          onPointerOut={(e) => {
            document.body.style.cursor = "auto";
            e.object.scale.set(
              0.2 / otherElementsScale,
              0.2 / otherElementsScale,
              0.2 / otherElementsScale
            );
          }}
          ref={arrowRef1}
        >
          <planeGeometry args={[1, 1]} />
          <primitive object={arrowMaterial1} attach="material" />
        </a.mesh>
      </a.group>
    </group>
  );
}
