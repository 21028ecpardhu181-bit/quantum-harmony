import { useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { BellState, measureBellState, BELL_STATES } from '@/lib/quantum';
import { Zap, RotateCcw } from 'lucide-react';

interface QubitSphereProps {
  measured: boolean;
  value: 0 | 1 | null;
  color: string;
}

function QubitSphere({ measured, value, color }: QubitSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current && glowRef.current) {
      if (!measured) {
        // Superposition animation
        const t = clock.getElapsedTime();
        const scale = 1 + Math.sin(t * 3) * 0.15;
        meshRef.current.scale.setScalar(scale);
        glowRef.current.scale.setScalar(scale * 1.8);
        meshRef.current.rotation.y = t * 2;
        meshRef.current.rotation.x = Math.sin(t) * 0.5;
      } else {
        // Measured state - stable
        meshRef.current.scale.setScalar(1);
        glowRef.current.scale.setScalar(1.5);
      }
    }
  });

  const displayColor = measured ? (value === 0 ? '#22c55e' : '#ef4444') : color;

  return (
    <group>
      <Sphere ref={glowRef} args={[0.5, 32, 32]}>
        <meshBasicMaterial color={displayColor} transparent opacity={0.2} />
      </Sphere>
      <Sphere ref={meshRef} args={[0.35, 32, 32]}>
        <meshStandardMaterial
          color={displayColor}
          emissive={displayColor}
          emissiveIntensity={measured ? 0.8 : 0.4}
          metalness={0.3}
          roughness={0.2}
        />
      </Sphere>
    </group>
  );
}

interface LabSceneProps {
  qubit1Measured: boolean;
  qubit2Measured: boolean;
  qubit1Value: 0 | 1 | null;
  qubit2Value: 0 | 1 | null;
}

function LabScene({ qubit1Measured, qubit2Measured, qubit1Value, qubit2Value }: LabSceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#00b4d8" />
      
      <group position={[-1.5, 0, 0]}>
        <QubitSphere measured={qubit1Measured} value={qubit1Value} color="#00b4d8" />
      </group>
      
      <group position={[1.5, 0, 0]}>
        <QubitSphere measured={qubit2Measured} value={qubit2Value} color="#0077b6" />
      </group>
      
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

export function MeasurementLab() {
  const [bellState, setBellState] = useState<BellState>('Φ+');
  const [qubit1Measured, setQubit1Measured] = useState(false);
  const [qubit2Measured, setQubit2Measured] = useState(false);
  const [qubit1Value, setQubit1Value] = useState<0 | 1 | null>(null);
  const [qubit2Value, setQubit2Value] = useState<0 | 1 | null>(null);
  const [measurementHistory, setMeasurementHistory] = useState<[0 | 1, 0 | 1][]>([]);

  const measure = useCallback(() => {
    const [v1, v2] = measureBellState(bellState);
    
    // Simulate instant correlation
    setQubit1Measured(true);
    setQubit1Value(v1);
    
    // Show the "spooky action" with slight delay for visual effect
    setTimeout(() => {
      setQubit2Measured(true);
      setQubit2Value(v2);
    }, 100);

    setMeasurementHistory(prev => [...prev, [v1, v2]]);
  }, [bellState]);

  const reset = useCallback(() => {
    setQubit1Measured(false);
    setQubit2Measured(false);
    setQubit1Value(null);
    setQubit2Value(null);
  }, []);

  const clearHistory = useCallback(() => {
    setMeasurementHistory([]);
  }, []);

  const bellStates: BellState[] = ['Φ+', 'Φ-', 'Ψ+', 'Ψ-'];

  return (
    <div className="space-y-6">
      {/* Bell state selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {bellStates.map((state) => (
          <Button
            key={state}
            variant={bellState === state ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setBellState(state);
              reset();
            }}
            className="font-mono"
          >
            |{state}⟩
          </Button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Bell State: <span className="font-mono text-primary">{BELL_STATES[bellState]}</span>
        </p>
      </div>

      {/* 3D visualization */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <div className="h-[250px] rounded-lg overflow-hidden bg-secondary/20">
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
              <LabScene 
                qubit1Measured={qubit1Measured}
                qubit2Measured={qubit2Measured}
                qubit1Value={qubit1Value}
                qubit2Value={qubit2Value}
              />
            </Canvas>
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex justify-between text-sm">
            <span className="bg-background/80 px-2 py-1 rounded font-mono">
              Qubit A: {qubit1Measured ? qubit1Value : '?'}
            </span>
            <span className="bg-background/80 px-2 py-1 rounded font-mono">
              Qubit B: {qubit2Measured ? qubit2Value : '?'}
            </span>
          </div>
        </div>

        {/* Controls and history */}
        <div className="space-y-4">
          <div className="flex gap-2 justify-center">
            <Button onClick={measure} disabled={qubit1Measured}>
              <Zap className="w-4 h-4 mr-2" />
              Measure
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {qubit1Measured && qubit2Measured && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-4 bg-primary/10 rounded-lg border border-primary/30 text-center"
              >
                <p className="text-sm text-muted-foreground mb-1">Measurement Result</p>
                <p className="font-mono text-2xl text-primary">
                  |{qubit1Value}{qubit2Value}⟩
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Both qubits collapsed instantly — demonstrating entanglement!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Measurement history */}
          {measurementHistory.length > 0 && (
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">History</p>
                <Button variant="ghost" size="sm" onClick={clearHistory}>
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {measurementHistory.slice(-20).map(([v1, v2], i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-secondary/50 rounded text-xs font-mono"
                  >
                    |{v1}{v2}⟩
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
