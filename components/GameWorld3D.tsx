
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const GameWorld3D: React.FC<{ isMatchmaking?: boolean; isMenuOpen?: boolean }> = ({ isMatchmaking, isMenuOpen }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); 
    scene.fog = new THREE.Fog(0x87CEEB, 30, 250);

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.set(0, 4, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    containerRef.current.appendChild(renderer.domElement);

    // --- LIGHTING ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sun = new THREE.DirectionalLight(0xfff4e6, 4.8);
    sun.position.set(40, 80, 40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    scene.add(sun);

    // --- REALISTIC CITY BG ---
    const cityGroup = new THREE.Group();
    const createAdvancedBuilding = (w: number, h: number, d: number) => {
      const g = new THREE.Group();
      const wallMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, roughness: 0.8 });
      const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, roughness: 0.01, metalness: 0.9, transmission: 0.2, thickness: 1, clearcoat: 1 });
      
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
      body.position.y = h/2;
      g.add(body);

      for(let i = 4; i < h; i += 7) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 3, d + 0.2), glassMat);
        win.position.y = i;
        g.add(win);
      }
      return g;
    };

    for(let i = 0; i < 40; i++) {
      const h = 20 + Math.random() * 60;
      const b = createAdvancedBuilding(8, h, 8);
      const angle = (i / 40) * Math.PI * 2;
      const radius = 70 + Math.random() * 50;
      b.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      cityGroup.add(b);
    }
    scene.add(cityGroup);

    // --- MAIN PLATFORM (REALISTIC CONCRETE) ---
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8.5, 1, 64),
      new THREE.MeshPhysicalMaterial({ color: 0x151515, roughness: 0.4, metalness: 0.2, clearcoat: 0.1 })
    );
    platform.position.y = -0.5;
    platform.receiveShadow = true;
    scene.add(platform);

    // --- CHARACTER (REFINED HERO) ---
    const char = new THREE.Group();
    const suitMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, roughness: 0.4 });
    const armorMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.9, clearcoat: 0.5 });
    const skinMat = new THREE.MeshPhysicalMaterial({ color: 0xffdbac });

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.25, 8, 16), suitMat);
    torso.position.y = 3.5; char.add(torso);
    const vest = new THREE.Mesh(new THREE.BoxGeometry(0.82, 1.0, 0.68), armorMat);
    vest.position.y = 3.55; char.add(vest);

    const createLeg = (side: number) => {
      const g = new THREE.Group(); g.position.set(side * 0.35, 2.3, 0);
      g.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 1.05), suitMat));
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.5, 0.8), armorMat);
      boot.position.y = -1.6; boot.position.z = 0.2; g.add(boot);
      return g;
    };
    char.add(createLeg(-1), createLeg(1));

    const head = new THREE.Group(); head.position.y = 4.8;
    head.add(new THREE.Mesh(new THREE.SphereGeometry(0.28), skinMat));
    const hlm = new THREE.Mesh(new THREE.SphereGeometry(0.34), armorMat); hlm.scale.set(1, 1, 0.8); head.add(hlm);
    const vis = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.1), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
    vis.position.z = 0.28; head.add(vis);
    char.add(head);

    char.traverse(n => { if(n instanceof THREE.Mesh) n.castShadow = true; });
    scene.add(char);

    const animate = () => {
      requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      char.position.y = Math.sin(t * 1.5) * 0.05;
      head.rotation.y = Math.sin(t * 0.6) * 0.25;
      cityGroup.rotation.y += 0.00015;

      if (isMatchmaking) camera.position.lerp(new THREE.Vector3(0, 6, 16), 0.02);
      else if (isMenuOpen) camera.position.lerp(new THREE.Vector3(-14, 6, 14), 0.05);
      else camera.position.lerp(new THREE.Vector3(0, 4.8, 24), 0.05);
      
      camera.lookAt(0, 4.5, 0);
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isMatchmaking, isMenuOpen]);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
};
