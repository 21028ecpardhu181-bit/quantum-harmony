import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onExplore: () => void;
}

export function HeroSection({ onExplore }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full border border-primary/20"
          style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full border border-primary/30"
          style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-[200px] h-[200px] rounded-full bg-primary/5"
          style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm text-primary font-medium">Interactive Quantum Visualization</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="text-foreground">Quantum</span>
          <br />
          <span className="text-primary">Entanglement</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Explore the mysterious world of quantum mechanics through interactive 3D visualizations. 
          Generate Bell states, manipulate qubits on the Bloch sphere, and witness the 
          "spooky action at a distance" that puzzled Einstein.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onExplore} className="text-lg px-8">
            Start Exploring
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg px-8">
            <a href="#learn">Learn the Science</a>
          </Button>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
