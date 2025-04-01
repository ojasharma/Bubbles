import React, { useRef, useMemo, useEffect, useState } from "react";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";
import { useSpring, a, useSprings } from "@react-spring/three";

export default function Model({ setHovered, hovered }) {
  const { nodes } = useGLTF("/medias/bubble3d.glb");
  const torus = useRef();
  const { camera } = useThree();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Load the arrow SVG
  const arrowSvg = useLoader(THREE.TextureLoader, "/arrow.svg");
   const arrowRef = useRef();
   const { gl } = useThree(); // Get the WebGL renderer

   const handleArrowClick1 = () => {
     // Open link in new tab
     window.open("https://github.com/ojasharma", "_blank");

     // Alternative: open in same tab
     // window.location.href = 'https://your-link-here.com';
   };
   const handleArrowClick2 = () => {
     // Open link in new tab
     window.open("https://x.com/DieselSharma", "_blank");

     // Alternative: open in same tab
     // window.location.href = 'https://your-link-here.com';
   };
  // Update windowWidth on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [scaleSpring, scaleApi] = useSpring(() => ({
    scale: 20,
    config: { tension: 120, friction: 14 },
  }));

  // Update scale when hover state changes
  useEffect(() => {
    scaleApi.start({
      scale: hovered ? 22 : 20, // Increase scale by 2 when hovered
      config: { tension: 120, friction: 14 },
    });
  }, [hovered, scaleApi]);

  const LG = useLoader(FontLoader, "/fonts/LG-R.json");
  const DL = useLoader(FontLoader, "/fonts/DL.json");

  const letters = useMemo(() => {
    const word = "BUBBLES";
    const spacing = 3;
    const material = new THREE.MeshStandardMaterial({ color: 0x666666 });

    return word.split("").map((char, i) => {
      const geometry = new TextGeometry(char, {
        font: LG,
        size: 6.5,
        height: 0.001,
        curveSegments: 12,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (i - word.length / 2) * spacing;
      return mesh;
    });
  }, [LG]);

  const hubblesLetters = useMemo(() => {
    const word = "Note TakeR";
    const spacing = 0.43;
    const material = new THREE.MeshStandardMaterial({ color: 0x666666 });

    return word.split("").map((char, i) => {
      const geometry = new TextGeometry(char, {
        font: DL,
        size: 0.3,
        height: 0.001,
        curveSegments: 12,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (i - word.length / 2) * spacing;
      return mesh;
    });
  }, [DL]);

  // Add Welcome text
  const welcomeLetters = useMemo(() => {
    const word = "WelcomE to";
    const spacing = 0.43;
    const material = new THREE.MeshStandardMaterial({ color: 0x666666 });

    return word.split("").map((char, i) => {
      const geometry = new TextGeometry(char, {
        font: DL,
        size: 0.3,
        height: 0.001,
        curveSegments: 12,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (i - word.length / 2) * spacing;
      return mesh;
    });
  }, [DL]);

  const letterRefs = useRef([]);
  letterRefs.current = [...letters, ...hubblesLetters, ...welcomeLetters];

  const [springs, api] = useSprings(letters.length, () => ({
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 120, friction: 20, precision: 0.001 },
  }));

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useRef(new THREE.Vector2());
  const [hoveredLetter, setHoveredLetter] = React.useState(null);
  const lastHoverTimes = useRef(Array(letters.length).fill(null));

  const [torusSpring, torusApi] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { tension: 80, friction: 12 },
  }));

  useEffect(() => {
    const onMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Effect to handle the rotation reset when hovered state changes
  useEffect(() => {
    if (hovered) {
      // When hovered, animate the torus back to [0, 0, 0] rotation
      torusApi.start({
        rotation: [0, 0, 0],
        config: { tension: 120, friction: 14 },
      });
    }
  }, [hovered, torusApi]);

  useFrame(() => {
    raycaster.setFromCamera(mouse.current, camera);

    const modelIntersects = raycaster.intersectObject(torus.current, true);
    const letterIntersects = raycaster.intersectObjects(
      letterRefs.current,
      true
    );

    let newHovered = null;

    if (letterIntersects.length > 0) {
      const letterHit = letterIntersects[0];
      const modelHit = modelIntersects.length > 0 ? modelIntersects[0] : null;

      if (!modelHit || modelHit.distance > letterHit.distance) {
        newHovered = letterHit.object;
      }
    }

    setHoveredLetter((prev) => (prev !== newHovered ? newHovered : prev));

    letterRefs.current.forEach((letter, i) => {
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

        api.start((index) =>
          index === i ? { rotation: [targetRotX, targetRotY, 0] } : null
        );
      }
    });

    const now = Date.now();
    lastHoverTimes.current.forEach((time, i) => {
      if (time && now - time > 1000) {
        api.start((index) => (index === i ? { rotation: [0, 0, 0] } : null));
        lastHoverTimes.current[i] = null;
      }
    });

    const TWO_PI = Math.PI * 2;

    // Only continue the automatic rotation when NOT hovered
    if (!hovered && torus.current) {
      torus.current.rotation.x = (torus.current.rotation.x + 0.003) % TWO_PI;
      torus.current.rotation.y = (torus.current.rotation.y + 0.003) % TWO_PI;

      torusApi.set({
        rotation: [
          torus.current.rotation.x,
          torus.current.rotation.y,
          torus.current.rotation.z,
        ],
      });
    }
  });

  const materialProps = {
    thickness: 1.1,
    roughness: 0,
    transmission: 1,
    ior: 1.2,
    chromaticAberration: 0.02,
    backside: true,
  };

  return (
    <a.group
      style={{
        transform: windowWidth <= 1109 ? "scale(0.8)" : "scale(1)",
        transition: "transform 0.3s ease", // Smooth transition
      }}
    >
      <group position={[1.5, 0, -5]}>
        {letters.map((mesh, i) => (
          <a.primitive object={mesh} key={i} rotation={springs[i].rotation} />
        ))}
        <group position={[6.7, -4, 0]}>
          {hubblesLetters.map((mesh, i) => (
            <a.primitive object={mesh} key={i} />
          ))}
        </group>
        {/* Add Welcome text group positioned at top left */}
        <group position={[-9.5, 4, 0]}>
          {welcomeLetters.map((mesh, i) => (
            <a.primitive object={mesh} key={`welcome-${i}`} />
          ))}
        </group>
      </group>

      <a.group scale={scaleSpring.scale} position={[0, 0, 0]}>
        <a.mesh
          ref={torus}
          geometry={nodes.Curve.geometry}
          rotation={torusSpring.rotation}
          onPointerOver={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <MeshTransmissionMaterial {...materialProps} />
        </a.mesh>
      </a.group>

      {/* Add arrow SVG to the scene */}
      <mesh
        position={[4.9, 2, 0]}
        rotation={[Math.PI, Math.PI, 0]} // Now this will work!
        scale={[0.2, 0.2, 0.2]}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
          // Safe hover effect with null check
          if (arrowRef.current) {
            arrowRef.current.scale.set(0.22, 0.22, 0.22);
          }
        }}
        onClick={handleArrowClick2}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          // Safe reset with null check
          if (arrowRef.current) {
            arrowRef.current.scale.set(0.2, 0.2, 0.2);
          }
        }}
      >
        <planeGeometry args={[1, 1]} /> {/* Width, height */}
        <meshBasicMaterial
          map={arrowSvg}
          transparent={true}
          side={THREE.DoubleSide} // Shows from both sides
        />
      </mesh>
      <mesh
        position={[-5, -2, 0]}
        rotation={[0, 0, 0]} // Now this will work!
        scale={[0.2, 0.2, 0.2]}
        onClick={handleArrowClick1}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
          // Safe hover effect with null check
          if (arrowRef.current) {
            arrowRef.current.scale.set(0.22, 0.22, 0.22);
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          // Safe reset with null check
          if (arrowRef.current) {
            arrowRef.current.scale.set(0.2, 0.2, 0.2);
          }
        }}
      >
        <planeGeometry args={[1, 1]} /> {/* Width, height */}
        <meshBasicMaterial
          map={arrowSvg}
          transparent={true}
          side={THREE.DoubleSide} // Shows from both sides
        />
      </mesh>
    </a.group>
  );
}
