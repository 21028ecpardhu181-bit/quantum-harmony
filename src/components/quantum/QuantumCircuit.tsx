import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';

type CircuitStep = 'initial' | 'hadamard' | 'cnot' | 'complete';

interface QubitVisualizerProps {
  label: string;
  state: string;
  isActive: boolean;
}

function QubitVisualizer({ label, state, isActive }: QubitVisualizerProps) {
  return (
    <motion.div
      className="flex items-center gap-4"
      animate={{ scale: isActive ? 1.05 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
        <span className="font-mono text-sm text-primary">{label}</span>
      </div>
      <motion.div
        className="px-4 py-2 rounded-lg bg-card border border-border font-mono text-lg"
        animate={{ 
          backgroundColor: isActive ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--card))',
          borderColor: isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'
        }}
      >
        {state}
      </motion.div>
    </motion.div>
  );
}

interface GateProps {
  name: string;
  symbol: string;
  isActive: boolean;
  description: string;
}

function Gate({ name, symbol, isActive, description }: GateProps) {
  return (
    <motion.div
      className="relative flex flex-col items-center"
      animate={{ scale: isActive ? 1.1 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-16 h-16 rounded-lg flex items-center justify-center font-mono text-xl font-bold"
        animate={{
          backgroundColor: isActive ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
          color: isActive ? 'hsl(var(--primary-foreground))' : 'hsl(var(--secondary-foreground))',
          boxShadow: isActive ? '0 0 20px hsl(var(--primary) / 0.5)' : 'none'
        }}
      >
        {symbol}
      </motion.div>
      <span className="mt-2 text-xs text-muted-foreground">{name}</span>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 p-2 bg-popover rounded-lg border border-border text-xs text-center shadow-lg"
          >
            {description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function QuantumCircuit() {
  const [step, setStep] = useState<CircuitStep>('initial');
  const [isRunning, setIsRunning] = useState(false);

  const getQubitStates = (): [string, string] => {
    switch (step) {
      case 'initial':
        return ['|0⟩', '|0⟩'];
      case 'hadamard':
        return ['|+⟩', '|0⟩'];
      case 'cnot':
      case 'complete':
        return ['|Φ⁺⟩', '|Φ⁺⟩'];
    }
  };

  const runCircuit = () => {
    setIsRunning(true);
    setStep('initial');
    
    setTimeout(() => setStep('hadamard'), 1000);
    setTimeout(() => setStep('cnot'), 2500);
    setTimeout(() => {
      setStep('complete');
      setIsRunning(false);
    }, 4000);
  };

  const reset = () => {
    setStep('initial');
    setIsRunning(false);
  };

  const [qubit1, qubit2] = getQubitStates();

  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-4">
        <Button onClick={runCircuit} disabled={isRunning}>
          <Play className="w-4 h-4 mr-2" />
          Run Circuit
        </Button>
        <Button variant="outline" onClick={reset} disabled={isRunning}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="relative p-8 bg-card rounded-xl border border-border">
        {/* Circuit diagram */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="space-y-8">
            <QubitVisualizer label="q₀" state={qubit1} isActive={step !== 'initial'} />
            <QubitVisualizer label="q₁" state={qubit2} isActive={step === 'cnot' || step === 'complete'} />
          </div>

          {/* Wire lines */}
          <div className="relative flex-1 max-w-md">
            <svg className="w-full h-32" viewBox="0 0 400 100">
              {/* Top wire */}
              <motion.line
                x1="0" y1="25" x2="400" y2="25"
                stroke="hsl(var(--muted))"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
              {/* Bottom wire */}
              <motion.line
                x1="0" y1="75" x2="400" y2="75"
                stroke="hsl(var(--muted))"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
              {/* CNOT connection */}
              <motion.line
                x1="280" y1="25" x2="280" y2="75"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                opacity={step === 'cnot' || step === 'complete' ? 1 : 0.3}
              />
              {/* CNOT control dot */}
              <motion.circle
                cx="280" cy="25" r="6"
                fill="hsl(var(--primary))"
                opacity={step === 'cnot' || step === 'complete' ? 1 : 0.3}
              />
              {/* CNOT target */}
              <motion.circle
                cx="280" cy="75" r="12"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                opacity={step === 'cnot' || step === 'complete' ? 1 : 0.3}
              />
              <motion.line
                x1="268" y1="75" x2="292" y2="75"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                opacity={step === 'cnot' || step === 'complete' ? 1 : 0.3}
              />
              <motion.line
                x1="280" y1="63" x2="280" y2="87"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                opacity={step === 'cnot' || step === 'complete' ? 1 : 0.3}
              />
            </svg>
            
            {/* Hadamard gate overlay */}
            <div className="absolute left-[20%] top-0 -translate-x-1/2">
              <Gate
                name="Hadamard"
                symbol="H"
                isActive={step === 'hadamard'}
                description="Creates superposition by rotating the qubit state"
              />
            </div>
          </div>
        </div>

        {/* State description */}
        <motion.div
          className="text-center p-4 bg-secondary/20 rounded-lg"
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {step === 'initial' && (
            <p className="font-mono">Initial state: <span className="text-primary">|00⟩</span></p>
          )}
          {step === 'hadamard' && (
            <p className="font-mono">After Hadamard: <span className="text-primary">(|0⟩ + |1⟩)/√2 ⊗ |0⟩</span></p>
          )}
          {(step === 'cnot' || step === 'complete') && (
            <p className="font-mono">Bell State |Φ⁺⟩: <span className="text-primary">(|00⟩ + |11⟩)/√2</span></p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
