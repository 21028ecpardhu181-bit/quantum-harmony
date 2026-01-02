import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { HeroSection } from '@/components/sections/HeroSection';
import { SectionWrapper } from '@/components/sections/SectionWrapper';
import { EntangledParticles } from '@/components/quantum/EntangledParticles';
import { BlochSphere } from '@/components/quantum/BlochSphere';
import { QuantumCircuit } from '@/components/quantum/QuantumCircuit';
import { MeasurementLab } from '@/components/quantum/MeasurementLab';
import { CorrelationStats } from '@/components/quantum/CorrelationStats';
import { EducationalContent } from '@/components/quantum/EducationalContent';
import { Atom, Boxes, CircleDot, FlaskConical, BarChart3, BookOpen } from 'lucide-react';

const Index = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  const scrollToParticles = useCallback(() => {
    particlesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Quantum Entanglement Visualizer | Interactive 3D Quantum Computing</title>
        <meta name="description" content="Explore quantum entanglement through interactive 3D visualizations. Generate Bell states, manipulate qubits on the Bloch sphere, and witness quantum correlations in action." />
        <meta name="keywords" content="quantum computing, entanglement, Bell states, Bloch sphere, quantum mechanics, qubits, Hadamard gate, CNOT gate" />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Navigation dots */}
        <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
          {[
            { id: 'hero', icon: Atom, label: 'Home' },
            { id: 'particles', icon: Boxes, label: 'Entangled Particles' },
            { id: 'circuit', icon: CircleDot, label: 'Quantum Circuit' },
            { id: 'bloch', icon: FlaskConical, label: 'Bloch Sphere' },
            { id: 'measurement', icon: FlaskConical, label: 'Measurement Lab' },
            { id: 'stats', icon: BarChart3, label: 'Statistics' },
            { id: 'learn', icon: BookOpen, label: 'Learn' },
          ].map(({ id, icon: Icon, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="group relative w-3 h-3 rounded-full bg-border hover:bg-primary transition-colors"
              aria-label={label}
            >
              <span className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-border">
                {label}
              </span>
            </a>
          ))}
        </nav>

        {/* Hero Section */}
        <div id="hero">
          <HeroSection onExplore={scrollToParticles} />
        </div>

        {/* Entangled Particles */}
        <div ref={particlesRef} id="particles">
          <SectionWrapper
            title="Entangled Particle Pairs"
            subtitle="Watch two quantum particles move in perfect synchronization, connected by an invisible quantum bond that defies classical physics."
          >
            <EntangledParticles />
            <div className="mt-8 p-6 bg-card rounded-xl border border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                These particles represent an entangled qubit pair. Despite being separated in space, 
                they share a quantum state. The wavy line connecting them symbolizes their entanglement — 
                a correlation that Albert Einstein famously called "spooky action at a distance."
              </p>
            </div>
          </SectionWrapper>
        </div>

        {/* Quantum Circuit Builder */}
        <SectionWrapper
          id="circuit"
          title="Bell State Circuit"
          subtitle="Learn how to create entanglement step-by-step using the Hadamard and CNOT gates."
          className="bg-secondary/10"
        >
          <QuantumCircuit />
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-xl border border-border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center font-mono text-primary">H</span>
                Hadamard Gate
              </h4>
              <p className="text-sm text-muted-foreground">
                The Hadamard gate creates an equal superposition of |0⟩ and |1⟩ states. 
                It's the first step in creating entanglement, preparing the control qubit 
                to be in a superposition before the CNOT gate acts.
              </p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-primary">⊕</span>
                CNOT Gate
              </h4>
              <p className="text-sm text-muted-foreground">
                The Controlled-NOT gate flips the target qubit only when the control qubit is |1⟩. 
                Combined with the Hadamard, it creates the entangled Bell state where both 
                qubits become correlated.
              </p>
            </div>
          </div>
        </SectionWrapper>

        {/* Bloch Sphere */}
        <SectionWrapper
          id="bloch"
          title="Bloch Sphere Visualization"
          subtitle="Explore how quantum states are represented on the Bloch sphere. Click the buttons to see different qubit states."
        >
          <BlochSphere />
          <div className="mt-8 p-6 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Bloch sphere is a geometric representation of a single qubit state. The north pole 
              represents |0⟩, the south pole represents |1⟩, and points on the equator represent 
              superposition states. The state vector (blue arrow) shows the current quantum state.
            </p>
          </div>
        </SectionWrapper>

        {/* Measurement Lab */}
        <SectionWrapper
          id="measurement"
          title="Entanglement Measurement Lab"
          subtitle="Experience quantum measurement firsthand. Select a Bell state and click 'Measure' to collapse the entangled qubits."
          className="bg-secondary/10"
        >
          <MeasurementLab />
        </SectionWrapper>

        {/* Correlation Statistics */}
        <SectionWrapper
          id="stats"
          title="Correlation Statistics"
          subtitle="Run simulations to see how quantum correlations emerge statistically. Watch the correlation coefficient converge as you collect more data."
        >
          <CorrelationStats />
          <div className="mt-8 p-6 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              In the Bell state |Φ⁺⟩, measuring qubit A as |0⟩ guarantees qubit B will also be |0⟩, 
              and vice versa for |1⟩. This perfect correlation (coefficient approaching 1.0) cannot 
              be explained by classical physics — it's a signature of quantum entanglement.
            </p>
          </div>
        </SectionWrapper>

        {/* Educational Content */}
        <SectionWrapper
          id="learn"
          title="Quantum Mechanics Fundamentals"
          subtitle="Deepen your understanding of the quantum concepts behind these visualizations."
          className="bg-secondary/10"
        >
          <EducationalContent />
        </SectionWrapper>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground">
              Built with ❤️ to make quantum physics accessible and interactive
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Quantum Entanglement Visualizer © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Index;
