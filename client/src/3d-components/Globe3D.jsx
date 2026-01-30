import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const StylizedGlobe = ({ size = 300 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene, camera, renderer, animationId;
    let globe, atmosphere, particles, lines, stars;
    let time = 0;

    try {
      // Scene setup with gradient background
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f1419);
      scene.fog = new THREE.Fog(0x0f1419, 800, 1500);

      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = size * 0.75;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        precision: "highp",
      });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowShadowMap;
      containerRef.current.appendChild(renderer.domElement);

      // ===== GLOBE WITH ADVANCED MATERIAL =====
      const globeGeometry = new THREE.IcosahedronGeometry(size / 5, 128);

      // Create custom canvas texture with gradient
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");

      // Create gradient texture
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#1a5f7a");
      gradient.addColorStop(0.5, "#0d8fab");
      gradient.addColorStop(1, "#0a4f6b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some subtle noise pattern
      for (let i = 0; i < canvas.width; i += 50) {
        for (let j = 0; j < canvas.height; j += 50) {
          ctx.fillStyle = `rgba(200, 160, 80, ${Math.random() * 0.08})`;
          ctx.fillRect(i, j, 30, 30);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;

      const globeMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        emissive: 0x1a5f7a,
        emissiveIntensity: 0.3,
        shininess: 150,
        reflectivity: 0.8,
      });

      globe = new THREE.Mesh(globeGeometry, globeMaterial);
      globe.castShadow = true;
      globe.receiveShadow = true;
      scene.add(globe);

      // ===== ATMOSPHERIC LAYERS =====
      // Layer 1: Inner glow
      const innerAtmosphereGeometry = new THREE.IcosahedronGeometry(
        size / 5 + 1.5,
        64
      );
      const innerAtmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00a3cc,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
      });
      const innerAtmosphere = new THREE.Mesh(
        innerAtmosphereGeometry,
        innerAtmosphereMaterial
      );
      scene.add(innerAtmosphere);

      // Layer 2: Outer glow
      const outerAtmosphereGeometry = new THREE.IcosahedronGeometry(
        size / 5 + 3.5,
        32
      );
      const outerAtmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xc8a050,
        transparent: true,
        opacity: 0.06,
        side: THREE.BackSide,
      });
      const outerAtmosphere = new THREE.Mesh(
        outerAtmosphereGeometry,
        outerAtmosphereMaterial
      );
      scene.add(outerAtmosphere);

      // ===== GLOWING RINGS =====
      const createRing = (radius, color, opacity, rotationAxis = [0, 0, 1]) => {
        const ringGeometry = new THREE.TorusGeometry(
          radius,
          radius * 0.08,
          32,
          200
        );
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: opacity,
          emissive: color,
          emissiveIntensity: 0.6,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.set(rotationAxis[0], rotationAxis[1], rotationAxis[2]);
        return ring;
      };

      const ring1 = createRing(size / 5 + 4, 0x00a3cc, 0.35, [
        Math.PI / 3,
        0,
        0,
      ]);
      const ring2 = createRing(size / 5 + 5.5, 0xc8a050, 0.25, [
        Math.PI / 2.5,
        Math.PI / 4,
        0,
      ]);
      const ring3 = createRing(size / 5 + 7, 0x5a9fb5, 0.15, [0, Math.PI / 3, 0]);

      scene.add(ring1, ring2, ring3);

      // ===== ADVANCED PARTICLE SYSTEM WITH TRAILS =====
      const particleCount = 400;
      const particlesGeometry = new THREE.BufferGeometry();

      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const angles = new Float32Array(particleCount);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = size / 5 + 2 + Math.random() * 1.5;

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(angle);
        positions[i * 3 + 1] = radius * Math.cos(phi);
        positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(angle);

        angles[i] = angle;
        sizes[i] = 1 + Math.random() * 1.5;

        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particlesGeometry.setAttribute(
        "size",
        new THREE.BufferAttribute(sizes, 1)
      );

      const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00a3cc,
        size: 2,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
      });

      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // ===== CONNECTING LINES =====
      const linesGeometry = new THREE.BufferGeometry();
      const linePositions = [];
      const lineIndices = [];

      for (let i = 0; i < particleCount; i++) {
        linePositions.push(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );

        // Connect to nearest neighbors
        if (i > 0 && Math.random() > 0.7) {
          lineIndices.push(i - 1, i);
        }
      }

      linesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(linePositions), 3)
      );

      const linesMaterial = new THREE.LineBasicMaterial({
        color: 0xc8a050,
        transparent: true,
        opacity: 0.15,
        linewidth: 1,
      });

      lines = new THREE.LineSegments(
        linesGeometry,
        linesMaterial
      );
      scene.add(lines);

      // ===== BACKGROUND STARS =====
      const starsGeometry = new THREE.BufferGeometry();
      const starPositions = [];
      const starSizes = [];

      for (let i = 0; i < 200; i++) {
        starPositions.push(
          (Math.random() - 0.5) * 500,
          (Math.random() - 0.5) * 500,
          (Math.random() - 0.5) * 500
        );
        starSizes.push(Math.random() * 1.5);
      }

      starsGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(starPositions), 3)
      );

      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
      });

      stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      // ===== ADVANCED LIGHTING =====
      // Main key light
      const keyLight = new THREE.DirectionalLight(0x00a3cc, 1.4);
      keyLight.position.set(8, 6, 8);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      scene.add(keyLight);

      // Fill light
      const fillLight = new THREE.DirectionalLight(0x1a5f7a, 0.7);
      fillLight.position.set(-8, -4, -8);
      scene.add(fillLight);

      // Rim light
      const rimLight = new THREE.DirectionalLight(0xc8a050, 0.5);
      rimLight.position.set(0, 10, -5);
      scene.add(rimLight);

      // Ambient light
      const ambientLight = new THREE.AmbientLight(0x1a3a4a, 0.4);
      scene.add(ambientLight);

      // Pulsing glow light
      const glowLight = new THREE.PointLight(0x00a3cc, 0.9);
      glowLight.position.set(0, 0, 0);
      scene.add(glowLight);

      // ===== ANIMATION LOOP =====
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        time += 0.016; // ~60fps

        // Globe rotation with slight wobble
        globe.rotation.y += 0.0005;
        globe.rotation.x = Math.sin(time * 0.3) * 0.15;
        globe.rotation.z = Math.cos(time * 0.2) * 0.1;

        // Inner atmosphere counter-rotation
        innerAtmosphere.rotation.y -= 0.0003;
        innerAtmosphere.rotation.x = Math.sin(time * 0.5) * 0.1;

        // Outer atmosphere slow rotation
        outerAtmosphere.rotation.y += 0.0001;
        outerAtmosphere.rotation.x = Math.cos(time * 0.3) * 0.08;

        // Ring rotations
        ring1.rotation.y += 0.003;
        ring1.rotation.x += Math.sin(time * 0.5) * 0.0005;

        ring2.rotation.z += 0.004;
        ring2.rotation.y += Math.sin(time * 0.3) * 0.0005;

        ring3.rotation.x += 0.002;
        ring3.rotation.z += Math.cos(time * 0.4) * 0.0005;

        // Update particles with orbital motion
        const posAttribute = particlesGeometry.getAttribute("position");
        const posArray = posAttribute.array;

        for (let i = 0; i < particleCount; i++) {
          const angle = (time * 0.5 + i * 0.01) * 0.05;
          const phi = (time * 0.3 + i * 0.005) * 0.03;
          const radius = size / 5 + 2 + Math.sin(time * 0.5 + i) * 1.5;

          posArray[i * 3] =
            radius * Math.sin(phi) * Math.cos(angle) +
            Math.sin(time + i) * 0.5;
          posArray[i * 3 + 1] =
            radius * Math.cos(phi) + Math.cos(time + i) * 0.5;
          posArray[i * 3 + 2] =
            radius * Math.sin(phi) * Math.sin(angle) +
            Math.sin(time * 0.7 + i) * 0.5;
        }
        posAttribute.needsUpdate = true;

        // Pulsing atmospheres
        innerAtmosphereMaterial.opacity =
          0.15 + Math.sin(time * 2) * 0.05;
        outerAtmosphereMaterial.opacity = 0.08 + Math.cos(time * 1.5) * 0.04;

        // Pulsing glow light
        glowLight.intensity = 1 + Math.sin(time * 2.5) * 0.3;

        // Pulsing particles opacity
        particlesMaterial.opacity = 0.7 + Math.sin(time * 1.8) * 0.15;

        // Pulsing rings
        ring1.material.opacity = 0.4 + Math.sin(time * 1.5) * 0.1;
        ring2.material.opacity = 0.3 + Math.cos(time * 1.3) * 0.1;
        ring3.material.opacity = 0.2 + Math.sin(time * 1.7) * 0.08;

        // Stars twinkling
        stars.rotation.y += 0.0001;

        // Smooth camera dolly
        camera.position.z =
          size * 0.75 + Math.sin(time * 0.5) * size * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      // Resize handler
      const handleResize = () => {
        if (containerRef.current) {
          const newSize = Math.min(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          );
          camera.aspect = 1;
          camera.updateProjectionMatrix();
          renderer.setSize(newSize, newSize);
        }
      };

      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", handleResize);

        if (
          containerRef.current &&
          renderer.domElement.parentNode === containerRef.current
        ) {
          containerRef.current.removeChild(renderer.domElement);
        }

        globeGeometry.dispose();
        globeMaterial.dispose();
        innerAtmosphereGeometry.dispose();
        innerAtmosphereMaterial.dispose();
        outerAtmosphereGeometry.dispose();
        outerAtmosphereMaterial.dispose();
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        linesGeometry.dispose();
        linesMaterial.dispose();
        starsGeometry.dispose();
        starsMaterial.dispose();
        renderer.dispose();
        canvas.remove();
      };
    } catch (error) {
      console.error("Error initializing 3D Globe:", error);

      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, #0066ff 0%, #000a1a 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #00ffff;
            font-size: 20px;
            font-weight: 800;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
            box-shadow: 
              0 0 30px rgba(0, 163, 204, 0.5),
              inset 0 0 30px rgba(26, 95, 122, 0.3);
            letter-spacing: 2px;
            font-family: 'Courier New', monospace;
          ">
            🌍<br/>GLOBAL
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
        margin: "0 auto",
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "0 0 50px rgba(0, 163, 204, 0.3), 0 0 80px rgba(200, 160, 80, 0.15)",
      }}
    />
  );
};

export default StylizedGlobe;