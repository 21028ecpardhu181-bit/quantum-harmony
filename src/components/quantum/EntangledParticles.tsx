import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleProps {
  position: [number, number, number];
  color: string;
  phase: number;
}

function Particle({ position, color, phase }: ParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current && glowRef.current) {
      const t = clock.getElapsedTime() + phase;
      
      // Pulsing effect
      const scale = 1 + Math.sin(t * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
      glowRef.current.scale.setScalar(scale * 1.5);
      
      // Orbital motion
      meshRef.current.position.x = position[0] + Math.sin(t * 0.5) * 0.3;
      meshRef.current.position.y = position[1] + Math.cos(t * 0.7) * 0.2;
      glowRef.current.position.copy(meshRef.current.position);
    }
  });

  return (
    <group>
      {/* Glow effect */}
      <Sphere ref={glowRef} args={[0.4, 32, 32]} position={position}>
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </Sphere>
      {/* Main particle */}
      <Sphere ref={meshRef} args={[0.25, 32, 32]} position={position}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.2}
        />
      </Sphere>
    </group>
  );
}

function EntanglementBond() {
  const lineRef = useRef<THREE.Line>(null);
  const pointsRef = useRef<THREE.Vector3[]>([]);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i <= 50; i++) {
      const progress = i / 50;
      const x = -2 + progress * 4;
      const waveY = Math.sin(progress * Math.PI * 4 + t * 3) * 0.15;
      const waveZ = Math.cos(progress * Math.PI * 4 + t * 3) * 0.15;
      points.push(new THREE.Vector3(x, waveY, waveZ));
    }
    
    pointsRef.current = points;
    
    if (lineRef.current) {
      const geometry = lineRef.current.geometry as THREE.BufferGeometry;
      const positions = new Float32Array(points.length * 3);
      points.forEach((point, i) => {
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
      });
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  });

  const initialPoints = useMemo(() => {
    return Array.from({ length: 51 }, (_, i) => {
      const progress = i / 50;
      return new THREE.Vector3(-2 + progress * 4, 0, 0);
    });
  }, []);

  return (
    <Line
      ref={lineRef as any}
      points={initialPoints}
      color="#00b4d8"
      lineWidth={2}
      transparent
      opacity={0.6}
    />
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00b4d8" />
      
      <Particle position={[-2, 0, 0]} color="#00b4d8" phase={0} />
      <Particle position={[2, 0, 0]} color="#0077b6" phase={Math.PI} />
      <EntanglementBond />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <Environment preset="night" />
    </>
  );
}

export function EntangledParticles() {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden bg-secondary/20">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
