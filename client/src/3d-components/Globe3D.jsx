import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const StylizedGlobe = ({ size = 300 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene, camera, renderer, controls, animationId;

    try {
      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = size * 0.6;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0.1);
      containerRef.current.appendChild(renderer.domElement);

      // Create Earth sphere with simple material (no shader complications)
      const earthGeometry = new THREE.IcosahedronGeometry(size / 5, 32);
      const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a47ff,
        emissive: 0x0d2bcc,
        shininess: 50,
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      scene.add(earth);

      // Add atmosphere glow - using simple MeshBasicMaterial instead of shader
      const atmosphereGeometry = new THREE.IcosahedronGeometry(size / 5 + 1, 32);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ccff,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);

      // Add data points
      const pointsGeometry = new THREE.BufferGeometry();
      const pointsMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 2,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      });

      // Create random points on sphere
      const points = [];
      for (let i = 0; i < 200; i++) {
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const radius = size / 5 + 2;

        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);

        points.push(x, y, z);
      }
      pointsGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(points), 3)
      );
      const dataPoints = new THREE.Points(pointsGeometry, pointsMaterial);
      scene.add(dataPoints);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x0088ff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.5;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.5;
      controls.enablePan = false;

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        earth.rotation.y += 0.001;
        atmosphere.rotation.y -= 0.0005;
        dataPoints.rotation.y += 0.002;

        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      // Cleanup function
      return () => {
        cancelAnimationFrame(animationId);
        if (
          containerRef.current &&
          renderer.domElement.parentNode === containerRef.current
        ) {
          containerRef.current.removeChild(renderer.domElement);
        }
        controls.dispose();
        renderer.dispose();
        earthGeometry.dispose();
        earthMaterial.dispose();
        atmosphereGeometry.dispose();
        atmosphereMaterial.dispose();
        pointsGeometry.dispose();
        pointsMaterial.dispose();
      };
    } catch (error) {
      console.error("Error initializing 3D Globe:", error);
      // Fallback to simple div if WebGL fails
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, #1a47ff, #00ccff);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
          ">
            Get Hired Easy
          </div>
        `;
      }
    }
  }, [size]);

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};

export default StylizedGlobe;