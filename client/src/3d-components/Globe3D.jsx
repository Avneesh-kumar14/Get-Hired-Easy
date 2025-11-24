import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const StylizedGlobe = ({ size = 300 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, globeMesh, dataMesh, glowMesh, controls;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = size * 0.5;
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      // Earth-like textured sphere with emphasis on blue water
      const textureLoader = new THREE.TextureLoader();
      const earthTexture = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/world.jpg');
      const waterTexture = new THREE.DataTexture(new Uint8Array([0, 255, 255]), 1, 1, THREE.RGBFormat);
      waterTexture.needsUpdate = true;

      const baseGeometry = new THREE.SphereGeometry(size / 4, 64, 64);
      const baseMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        specularMap: waterTexture,
        specular: new THREE.Color(0x111111),
        shininess: 100
      });
      globeMesh = new THREE.Mesh(baseGeometry, baseMaterial);
      scene.add(globeMesh);

      // Enhanced data visualization layer
      const dataGeometry = new THREE.SphereGeometry(size / 4 + 0.2, 128, 128);
      const dataShaderMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vPos;
          varying vec2 vUv;
          uniform float time;
          
          void main() {
            vPos = position;
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 15.0 + time) * cos(pos.y * 15.0 + time) * 0.3;
            pos += normal * elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vPos;
          varying vec2 vUv;
          uniform float time;
          uniform float sphereRadius;
          
          void main() {
            vec2 grid = abs(fract(vUv * 60.0) - 0.5);
            float dot = length(grid);
            
            vec3 color1 = vec3(0.0, 0.5, 1.0);  // Bright blue
            vec3 color2 = vec3(0.0, 1.0, 1.0);  // Cyan
            
            float pulse = sin(time * 2.0) * 0.5 + 0.5;
            vec3 finalColor = mix(color1, color2, pulse);
            
            float alpha = smoothstep(0.15, 0.05, dot) * 0.7;
            alpha *= (1.0 - abs(vPos.y / sphereRadius)) * 2.0;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        uniforms: {
          time: { value: 0 },
          sphereRadius: { value: size / 4 }
        },
        blending: THREE.AdditiveBlending,
      });
      dataMesh = new THREE.Mesh(dataGeometry, dataShaderMaterial);
      scene.add(dataMesh);

      // Enhanced outer glow effect
      const glowGeometry = new THREE.SphereGeometry(size / 4 + 2, 64, 64);
      const glowMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform float time;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            vec3 color = mix(
              vec3(0.0, 0.5, 1.0),
              vec3(0.0, 1.0, 1.0),
              sin(time * 1.5) * 0.5 + 0.5
            );
            gl_FragColor = vec4(color, 1.0) * intensity * 1.5;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        uniforms: {
          time: { value: 0 }
        }
      });
      glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.scale.set(1.3, 1.3, 1.3);
      scene.add(glowMesh);

      // Enhanced data spikes
      const createSpikes = () => {
        const group = new THREE.Group();
        const spikeCount = 70;
        
        for (let i = 0; i < spikeCount; i++) {
          const height = Math.random() * (size / 6) + (size / 12);
          const geometry = new THREE.CylinderGeometry(0.7, 0, height, 4);
          const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0x00ffff),
            shininess: 100,
            specular: 0xffffff,
            transparent: true,
            opacity: 0.8,
          });
          
          const spike = new THREE.Mesh(geometry, material);
          
          const phi = Math.random() * Math.PI * 2;
          const theta = Math.random() * Math.PI;
          const radius = size / 4;
          
          spike.position.x = radius * Math.sin(theta) * Math.cos(phi);
          spike.position.y = radius * Math.sin(theta) * Math.sin(phi);
          spike.position.z = radius * Math.cos(theta);
          
          spike.lookAt(0, 0, 0);
          spike.rotateX(Math.PI / 2);
          
          group.add(spike);
        }
        return group;
      };
      
      const spikes = createSpikes();
      scene.add(spikes);

      // Enhanced lighting
      const ambientLight = new THREE.AmbientLight(0x0077ff, 0.3);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0x00ffff, 1.2);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);

      // Point lights for extra glow
      const pointLight1 = new THREE.PointLight(0x00ffff, 1, size);
      pointLight1.position.set(size/4, 0, 0);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x0088ff, 1, size);
      pointLight2.position.set(-size/4, 0, 0);
      scene.add(pointLight2);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.3;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1;
      controls.enablePan = false;

      let time = 0;
      const animate = () => {
        requestAnimationFrame(animate);
        time += 0.015;

        dataMesh.material.uniforms.time.value = time;
        glowMesh.material.uniforms.time.value = time;
        
        globeMesh.rotation.y += 0.001;
        dataMesh.rotation.y += 0.003;
        spikes.rotation.y += 0.002;
        
        spikes.children.forEach((spike, i) => {
          spike.scale.y = 1 + Math.sin(time * 3 + i) * 0.2;
          spike.material.opacity = 0.6 + Math.sin(time * 4 + i) * 0.4;
        });

        pointLight1.position.x = Math.sin(time) * size/4;
        pointLight1.position.z = Math.cos(time) * size/4;
        pointLight2.position.x = -Math.sin(time * 0.8) * size/4;
        pointLight2.position.z = -Math.cos(time * 0.8) * size/4;

        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    };

    init();

    return () => {
      containerRef.current?.removeChild(renderer.domElement);
      controls.dispose();
      renderer.dispose();
    };
  }, [size]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: size, 
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }} 
    />
  );
};

export default StylizedGlobe;