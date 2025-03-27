"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export default function BubblesText() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const loader = new FontLoader();
    loader.load("/fonts/LG-R.json", (font) => {
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

      const letters = [];
      const word = "BUBBLES";
      const spacing = 3;

      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const geometry = new TextGeometry(char, {
          font: font,
          size: 6,
          height: 0.01,
          curveSegments: 12,
        });
        geometry.center();
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (i - word.length / 2) * spacing;
        mesh.userData = { targetRotX: 0, targetRotY: 0 };
        scene.add(mesh);
        letters.push(mesh);
      }

      let hoveredLetter = null;

      const animate = () => {
        requestAnimationFrame(animate);

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(letters);

        let newHoveredLetter = null;
        if (intersects.length > 0) {
          newHoveredLetter = intersects[0].object;
        }

        if (hoveredLetter !== newHoveredLetter) {
          hoveredLetter = newHoveredLetter;
        }

        letters.forEach((letter) => {
          if (letter === hoveredLetter) {
            const vector = letter.position.clone();
            vector.project(camera);

            const letterScreenX = vector.x;
            const letterScreenY = vector.y;

            const deltaX = THREE.MathUtils.clamp(
              mouse.x - letterScreenX,
              -0.1,
              0.1
            );
            const deltaY = THREE.MathUtils.clamp(
              mouse.y - letterScreenY,
              -0.1,
              0.1
            );

            letter.userData.targetRotX = -deltaY * 10;
            letter.userData.targetRotY = deltaX * 40.0;
          } else {
            letter.userData.targetRotX *= 1;
            letter.userData.targetRotY *= 1;
          }

          letter.rotation.x +=
            (letter.userData.targetRotX - letter.rotation.x) * 0.051;
          letter.rotation.y +=
            (letter.userData.targetRotY - letter.rotation.y) * 0.051;
        });

        renderer.render(scene, camera);
      };

      animate();
    });

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
