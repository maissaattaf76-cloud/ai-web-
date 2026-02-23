
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- CONTROLS COMPONENT ---
const MobileControls: React.FC<{ 
  onMove: (x: number, y: number) => void;
  onAction: (type: string) => void;
}> = ({ onMove, onAction }) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => setIsDragging(true);
  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 60);
    const angle = Math.atan2(dy, dx);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    setKnobPos({ x, y });
    onMove(x / 60, -y / 60);
  };
  const handleEnd = () => {
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    onMove(0, 0);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-[2100] md:hidden">
      <div 
        ref={joystickRef}
        className="absolute bottom-24 left-24 w-40 h-40 bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-full pointer-events-auto"
        onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}
        onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleEnd}
      >
        <div className="absolute w-16 h-16 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)]"
             style={{ left: '50%', top: '50%', transform: `translate(calc(-50% + ${knobPos.x}px), calc(-50% + ${knobPos.y}px))` }} />
      </div>
      <div className="absolute bottom-24 right-24 flex gap-8 pointer-events-auto">
        <button onClick={() => onAction('jump')} className="w-24 h-24 bg-white/10 border-2 border-white/20 rounded-full flex items-center justify-center text-5xl active:scale-90 shadow-2xl backdrop-blur-xl">🦘</button>
        <button onClick={() => onAction('shoot')} className="w-28 h-28 bg-red-600 border-4 border-white/40 rounded-full flex items-center justify-center text-6xl active:scale-90 shadow-[0_0_40px_rgba(220,38,38,0.7)]">🔥</button>
      </div>
    </div>
  );
};

const RoleplayCity3D: React.FC<{ moveDir: { x: number, z: number } }> = ({ moveDir }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const rotationTarget = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 150, 1800);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    containerRef.current.appendChild(renderer.domElement);

    // --- CITY SETUP ---
    const blockSize = 150;
    const roadWidth = 80;
    const citySize = 5;
    const cityGroup = new THREE.Group();

    // Materials
    const roadMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, roughness: 0.75, metalness: 0.1 });
    const sidewalkMat = new THREE.MeshPhysicalMaterial({ color: 0x666666, roughness: 0.6 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xadd8e6, roughness: 0.01, metalness: 0.9, transmission: 0.2, thickness: 2, clearcoat: 1 });
    const buildingMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, roughness: 0.8 });
    const markMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const yellowLineMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });

    // Ground Road Surface
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), roadMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const createTree = (x: number, z: number) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0.5, z);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 5), new THREE.MeshStandardMaterial({ color: 0x4a2c14 }));
      trunk.position.y = 2.5;
      tree.add(trunk);
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), new THREE.MeshStandardMaterial({ color: 0x1b4d3e }));
      foliage.position.y = 6;
      tree.add(foliage);
      return tree;
    };

    const createLamp = (x: number, z: number) => {
      const lamp = new THREE.Group();
      lamp.position.set(x, 0.5, z);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 12), new THREE.MeshStandardMaterial({ color: 0x111111 }));
      pole.position.y = 6;
      lamp.add(pole);
      const top = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 1), new THREE.MeshStandardMaterial({ color: 0x222222 }));
      top.position.set(1, 12, 0);
      lamp.add(top);
      return lamp;
    };

    for (let x = -citySize; x <= citySize; x++) {
      for (let z = -citySize; z <= citySize; z++) {
        const blockX = x * (blockSize + roadWidth);
        const blockZ = z * (blockSize + roadWidth);
        
        // 1. Sidewalk with Curbs
        const sw = new THREE.Mesh(new THREE.BoxGeometry(blockSize + 10, 2.5, blockSize + 10), sidewalkMat);
        sw.position.set(blockX, 1.25, blockZ);
        sw.receiveShadow = true;
        cityGroup.add(sw);

        // 2. Buildings (Architecture variety)
        const subCount = 2;
        const bDim = blockSize / subCount;
        for(let i = 0; i < subCount; i++) {
          for(let j = 0; j < subCount; j++) {
            const h = 50 + Math.random() * 250;
            const bGroup = new THREE.Group();
            const bBody = new THREE.Mesh(new THREE.BoxGeometry(bDim * 0.85, h, bDim * 0.85), buildingMat);
            bBody.position.y = h/2;
            bGroup.add(bBody);

            // Window Design
            const glassRing = new THREE.Mesh(new THREE.BoxGeometry(bDim * 0.85 + 0.5, 5, bDim * 0.85 + 0.5), glassMat);
            for(let k = 15; k < h; k += 20) {
              const ring = glassRing.clone(); ring.position.y = k; bGroup.add(ring);
            }

            bGroup.position.set(blockX - blockSize/2 + bDim*(i+0.5), 2.5, blockZ - blockSize/2 + bDim*(j+0.5));
            bGroup.traverse(m => { if(m instanceof THREE.Mesh) m.castShadow = true; });
            cityGroup.add(bGroup);
          }
        }

        // 3. Road Elements
        // Central Yellow Line
        const yLine = new THREE.Mesh(new THREE.PlaneGeometry(blockSize + roadWidth, 1.2), yellowLineMat);
        yLine.rotation.x = -Math.PI/2;
        yLine.position.set(blockX, 0.08, blockZ + blockSize/2 + roadWidth/2);
        cityGroup.add(yLine);

        // Crosswalks (Realistic Bars)
        for(let c = -5; c <= 5; c++) {
          const bar = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth * 0.35, 5), markMat);
          bar.rotation.x = -Math.PI/2;
          bar.position.set(blockX + blockSize/2 + roadWidth/2, 0.1, blockZ + c * 10);
          cityGroup.add(bar);
        }

        // 4. Props (Trees and Lamps)
        if(Math.abs(x) < citySize && Math.abs(z) < citySize) {
           cityGroup.add(createTree(blockX - blockSize/2 - 8, blockZ - blockSize/2 - 8));
           cityGroup.add(createLamp(blockX + blockSize/2 + 8, blockZ + blockSize/2 + 8));
        }
      }
    }
    scene.add(cityGroup);

    // --- PLAYER (HERO STYLE) ---
    const charGroup = new THREE.Group();
    const suit = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, roughness: 0.4 });
    const armor = new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.9, clearcoat: 0.5 });
    const skin = new THREE.MeshPhysicalMaterial({ color: 0xffdbac });

    const pBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 1.3, 8, 16), suit);
    pBody.position.y = 3.4; charGroup.add(pBody);
    
    const pVest = new THREE.Mesh(new THREE.BoxGeometry(0.82, 1.0, 0.65), armor);
    pVest.position.y = 3.5; charGroup.add(pVest);

    const head = new THREE.Group(); head.position.y = 4.8;
    head.add(new THREE.Mesh(new THREE.SphereGeometry(0.28), skin));
    const hlm = new THREE.Mesh(new THREE.SphereGeometry(0.34), armor); hlm.scale.set(1, 1, 0.8); head.add(hlm);
    const vis = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.1), new THREE.MeshBasicMaterial({ color: 0x00ffff })); vis.position.z = 0.28; head.add(vis);
    charGroup.add(head);

    const createLeg = (side: number) => {
      const g = new THREE.Group(); g.position.set(side * 0.35, 2.3, 0);
      g.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 1.0), suit));
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.55, 0.8), armor); b.position.y = -1.6; b.position.z = 0.2; g.add(b);
      return g;
    };
    leftLegRef.current = createLeg(-1);
    rightLegRef.current = createLeg(1);
    charGroup.add(leftLegRef.current, rightLegRef.current);

    charGroup.traverse(m => { if(m instanceof THREE.Mesh) m.castShadow = true; });
    scene.add(charGroup);
    playerRef.current = charGroup;

    // --- LIGHTING ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const sunlight = new THREE.DirectionalLight(0xfff4e6, 4.0);
    sunlight.position.set(200, 400, 200);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(4096, 4096);
    sunlight.shadow.camera.left = -1000;
    sunlight.shadow.camera.right = 1000;
    sunlight.shadow.camera.top = 1000;
    sunlight.shadow.camera.bottom = -1000;
    scene.add(sunlight);

    const animate = () => {
      requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      if (playerRef.current) {
        const isMoving = moveDir.x !== 0 || moveDir.z !== 0;
        const targetSpeed = isMoving ? 1.3 : 0;
        velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, moveDir.x * targetSpeed, 0.1);
        velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, -moveDir.z * targetSpeed, 0.1);
        playerRef.current.position.add(velocity.current);

        if (isMoving) {
          rotationTarget.current = Math.atan2(moveDir.x, moveDir.z);
          const walk = Math.sin(t * 18) * 0.8;
          if (leftLegRef.current) leftLegRef.current.rotation.x = walk;
          if (rightLegRef.current) rightLegRef.current.rotation.x = -walk;
        }
        playerRef.current.rotation.y = THREE.MathUtils.lerp(playerRef.current.rotation.y, rotationTarget.current, 0.2);
        
        camera.position.lerp(new THREE.Vector3(playerRef.current.position.x, playerRef.current.position.y + 25, playerRef.current.position.z + 42), 0.1);
        camera.lookAt(playerRef.current.position.x, playerRef.current.position.y + 6, playerRef.current.position.z);
      }
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
  }, [moveDir]);

  return <div ref={containerRef} className="absolute inset-0 z-0 bg-[#add8e6]" />;
};

export const Gameplay: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [moveDir, setMoveDir] = useState({ x: 0, z: 0 });
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    const handleUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  useEffect(() => {
    const x = (keys['a'] || keys['arrowleft'] ? -1 : 0) + (keys['d'] || keys['arrowright'] ? 1 : 0);
    const z = (keys['w'] || keys['arrowup'] ? 1 : 0) + (keys['s'] || keys['arrowdown'] ? -1 : 0);
    setMoveDir({ x, z });
  }, [keys]);

  return (
    <div className="absolute inset-0 z-[2000] bg-[#add8e6] overflow-hidden font-rajdhani" dir="ltr">
      <RoleplayCity3D moveDir={moveDir} />
      <MobileControls onMove={(x, z) => setMoveDir({ x, z })} onAction={() => {}} />

      <div className="absolute top-12 left-12 z-50 flex flex-col gap-6">
         <div className="glass-panel p-8 rounded-[40px] border-2 border-white/20 min-w-[320px] shadow-[0_25px_100px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-center mb-4">
               <span className="text-red-500 font-black tracking-[0.4em] uppercase text-[12px] drop-shadow-[0_0_10px_red]">CITY_SECTOR_07</span>
               <span className="text-white font-black italic text-4xl tracking-tighter">100 HP</span>
            </div>
            <div className="h-5 w-full bg-white/10 rounded-full p-1 border border-white/5">
               <div className="h-full bg-gradient-to-r from-red-700 to-red-400 rounded-full shadow-[0_0_20px_red] w-full" />
            </div>
         </div>
      </div>

      <div className="absolute top-12 right-12 z-[2200]">
         <button onClick={onExit} className="px-12 py-5 bg-red-600 border-2 border-white/20 text-white rounded-[28px] font-black uppercase text-sm tracking-widest hover:scale-110 hover:bg-red-500 transition-all shadow-[0_20px_50px_rgba(220,38,38,0.5)] active:scale-95">
           EXTRACT NOW
         </button>
      </div>
    </div>
  );
};
