import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import * as THREE from "three";
import { useSignUp } from "@clerk/nextjs";

export default function CompanyIconElements({
  clicked,
  isReturning,
  setIsLoading,
}) {
  // --- Authentication ---
  const { signUp } = useSignUp();

  // --- Load Assets ---
  const googleSvg = useLoader(THREE.TextureLoader, "/google.svg");
  const appleSvg = useLoader(THREE.TextureLoader, "/apple.svg");
  const microsoftSvg = useLoader(THREE.TextureLoader, "/microsoft.svg");
  const facebookSvg = useLoader(THREE.TextureLoader, "/facebook.svg");

  // --- Materials ---
  const googleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: googleSvg,
        transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(1, 1, 1),
        toneMapped: false,
      }),
    [googleSvg]
  );

  const appleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: appleSvg,
        transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(1, 1, 1),
        toneMapped: false,
      }),
    [appleSvg]
  );

  const microsoftMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: microsoftSvg,
        transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(1, 1, 1),
        toneMapped: false,
      }),
    [microsoftSvg]
  );

  const facebookMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: facebookSvg,
        transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(1, 1, 1),
        toneMapped: false,
      }),
    [facebookSvg]
  );

  // --- Springs for Animation ---
  const springConfig = useMemo(() => {
    return clicked
      ? { tension: 130, friction: 30, mass: 2 }
      : { tension: 60, friction: 30, mass: 1.5 };
  }, [clicked]);

  // Google logo spring
  const [googleSpring, googleApi] = useSpring(() => ({
    position: [0, 0, 0],
    opacity: 0,
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

  // --- Update animations based on state ---
  React.useEffect(() => {
    if (clicked) {
      // Show and position logos
      googleApi.start({
        position: [0, 2.3, 0],
        opacity: 1,
        config: springConfig,
      });
      appleApi.start({
        position: [0, -2.3, 0],
        opacity: 1,
        config: springConfig,
      });
      microsoftApi.start({
        position: [2.3, 0, 0],
        opacity: 1,
        config: springConfig,
      });
      facebookApi.start({
        position: [-2.3, 0, 0],
        opacity: 1,
        config: springConfig,
      });
    } else {
      // Hide and reset logo positions
      googleApi.start({
        position: [0, 0, 0],
        opacity: 0,
        config: springConfig,
      });
      appleApi.start({
        position: [0, 0, 0],
        opacity: 0,
        config: springConfig,
      });
      microsoftApi.start({
        position: [0, 0, 0],
        opacity: 0,
        config: springConfig,
      });
      facebookApi.start({
        position: [0, 0, 0],
        opacity: 0,
        config: springConfig,
      });
    }
  }, [
    clicked,
    isReturning,
    googleApi,
    appleApi,
    microsoftApi,
    facebookApi,
    springConfig,
  ]);

  // --- Google Click Handler ---
  const handleGoogleClick = async () => {
    if (!clicked) return; // Only allow clicks when icons are visible
    setIsLoading(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
      });
    } catch (err) {
      console.error("Google SSO error:", err);
      setIsLoading(false);
    }
  };

  // --- Microsoft Click Handler ---
  const handleMicrosoftClick = async () => {
    if (!clicked) return;
    setIsLoading(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_microsoft",
        redirectUrl: "/dashboard",
      });
    } catch (err) {
      console.error("Microsoft SSO error:", err);
      setIsLoading(false);
    }
  };

  // --- Facebook Click Handler ---
  const handleFacebookClick = async () => {
    if (!clicked) return;
    setIsLoading(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_facebook",
        redirectUrl: "/dashboard",
      });
    } catch (err) {
      console.error("Facebook SSO error:", err);
      setIsLoading(false);
    }
  };

  // --- Render ---
  return (
    <group>
      {/* Google Logo */}
      <a.mesh
        position={googleSpring.position}
        scale={[0.6, 0.6, 0.6]}
        onClick={handleGoogleClick}
        onPointerOver={() =>
          clicked && (document.body.style.cursor = "pointer")
        }
        onPointerOut={() => (document.body.style.cursor = "auto")}
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
      <a.mesh
        position={microsoftSpring.position}
        scale={[0.6, 0.6, 0.6]}
        onClick={handleMicrosoftClick}
        onPointerOver={() =>
          clicked && (document.body.style.cursor = "pointer")
        }
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <planeGeometry args={[1, 1]} />
        <a.primitive
          object={microsoftMaterial}
          attach="material"
          opacity={microsoftSpring.opacity}
        />
      </a.mesh>

      {/* Facebook Logo */}
      <a.mesh
        position={facebookSpring.position}
        scale={[0.6, 0.6, 0.6]}
        onClick={handleFacebookClick}
        onPointerOver={() =>
          clicked && (document.body.style.cursor = "pointer")
        }
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <planeGeometry args={[1, 1]} />
        <a.primitive
          object={facebookMaterial}
          attach="material"
          opacity={facebookSpring.opacity}
        />
      </a.mesh>
    </group>
  );
}
