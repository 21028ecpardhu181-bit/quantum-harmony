import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { stateToBloch, STATE_ZERO, STATE_ONE, STATE_PLUS, STATE_MINUS, QubitState } from '@/lib/quantum';
import { Button } from '@/components/ui/button';

interface StateVectorProps {
  state: QubitState;
}

function StateVector({ state }: StateVectorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const bloch = stateToBloch(state);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(bloch.x, bloch.z, bloch.y);
    }
  });

  const arrowPoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(bloch.x, bloch.z, bloch.y),
  ];

  return (
    <group>
      <Line points={arrowPoints} color="#00b4d8" lineWidth={3} />
      <Sphere ref={meshRef} args={[0.08, 16, 16]} position={[bloch.x, bloch.z, bloch.y]}>
        <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={0.5} />
      </Sphere>
    </group>
  );
}

function BlochSphereGeometry() {
  // Create circle points for the three main planes
  const createCircle = (axis: 'xy' | 'xz' | 'yz') => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      switch (axis) {
        case 'xy':
          points.push(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0));
          break;
        case 'xz':
          points.push(new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)));
          break;
        case 'yz':
          points.push(new THREE.Vector3(0, Math.cos(angle), Math.sin(angle)));
          break;
      }
    }
    return points;
  };

  return (
    <group>
      {/* Transparent sphere */}
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial
          color="#94a3b8"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      {/* Main circles */}
      <Line points={createCircle('xy')} color="#64748b" lineWidth={1} transparent opacity={0.5} />
      <Line points={createCircle('xz')} color="#64748b" lineWidth={1} transparent opacity={0.5} />
      <Line points={createCircle('yz')} color="#64748b" lineWidth={1} transparent opacity={0.5} />
      
      {/* Axes */}
      <Line points={[new THREE.Vector3(-1.3, 0, 0), new THREE.Vector3(1.3, 0, 0)]} color="#ef4444" lineWidth={1.5} />
      <Line points={[new THREE.Vector3(0, -1.3, 0), new THREE.Vector3(0, 1.3, 0)]} color="#22c55e" lineWidth={1.5} />
      <Line points={[new THREE.Vector3(0, 0, -1.3), new THREE.Vector3(0, 0, 1.3)]} color="#3b82f6" lineWidth={1.5} />
      
      {/* Labels */}
      <Text position={[0, 1.5, 0]} fontSize={0.15} color="#22c55e">|0⟩</Text>
      <Text position={[0, -1.5, 0]} fontSize={0.15} color="#22c55e">|1⟩</Text>
      <Text position={[1.5, 0, 0]} fontSize={0.15} color="#ef4444">|+⟩</Text>
      <Text position={[-1.5, 0, 0]} fontSize={0.15} color="#ef4444">|-⟩</Text>
      <Text position={[0, 0, 1.5]} fontSize={0.15} color="#3b82f6">|+i⟩</Text>
      <Text position={[0, 0, -1.5]} fontSize={0.15} color="#3b82f6">|-i⟩</Text>
    </group>
  );
}

interface SceneProps {
  state: QubitState;
}

function Scene({ state }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      
      <BlochSphereGeometry />
      <StateVector state={state} />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
      />
    </>
  );
}

export function BlochSphere() {
  const [currentState, setCurrentState] = useState<QubitState>(STATE_ZERO);
  const [stateName, setStateName] = useState('|0⟩');

  const setState = useCallback((state: QubitState, name: string) => {
    setCurrentState(state);
    setStateName(name);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={stateName === '|0⟩' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setState(STATE_ZERO, '|0⟩')}
        >
          |0⟩
        </Button>
        <Button
          variant={stateName === '|1⟩' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setState(STATE_ONE, '|1⟩')}
        >
          |1⟩
        </Button>
        <Button
          variant={stateName === '|+⟩' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setState(STATE_PLUS, '|+⟩')}
        >
          |+⟩
        </Button>
        <Button
          variant={stateName === '|-⟩' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setState(STATE_MINUS, '|-⟩')}
        >
          |-⟩
        </Button>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Current State: <span className="font-mono text-primary font-semibold">{stateName}</span>
        </p>
      </div>
      
      <div className="w-full h-[400px] rounded-lg overflow-hidden bg-secondary/20">
        <Canvas camera={{ position: [2.5, 2, 2.5], fov: 50 }}>
          <Scene state={currentState} />
        </Canvas>
      </div>
    </div>
  );
}
